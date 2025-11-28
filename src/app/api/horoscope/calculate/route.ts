import { NextRequest, NextResponse } from "next/server";
import { getLocation } from "@/lib/opencage";
import { generateBasicReading } from "@/lib/openai";
import { calculateHoroscope, calculateElementPattern, formatChartDataForAI } from "@/lib/horoscope";
import { createReading, checkRateLimit } from "@/lib/supabase";
import type { BirthData, ReadingStyle } from "@/types";

interface CalculateRequest {
  birthDate: {
    year: number;
    month: number;
    day: number;
  };
  birthTime: {
    hour: number;
    minute: number;
    isKnown: boolean;
  };
  birthPlace: string;
  latitude?: number;
  longitude?: number;
  style: ReadingStyle;
}

export async function POST(request: NextRequest) {
  try {
    // レート制限チェック
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
               request.headers.get("x-real-ip") || 
               "unknown";
    
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json(
        { error: "レート制限を超えました。1時間後に再度お試しください。" },
        { status: 429 }
      );
    }

    // リクエストボディを取得
    const body: CalculateRequest = await request.json();

    // バリデーション
    if (!body.birthDate) {
      return NextResponse.json(
        { error: "生年月日が不足しています" },
        { status: 400 }
      );
    }

    // 緯度経度を決定
    let lat: number;
    let lng: number;
    let locationName: string;
    let timezone: string;

    if (body.latitude !== undefined && body.longitude !== undefined) {
      // 緯度経度が直接指定されている場合
      lat = body.latitude;
      lng = body.longitude;
      locationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      // 日本国内かどうかで大まかにタイムゾーンを判定
      timezone = (lng > 120 && lng < 150 && lat > 20 && lat < 50) ? "Asia/Tokyo" : "UTC";
    } else if (body.birthPlace) {
      // 都道府県名から緯度経度を取得
      const location = await getLocation(body.birthPlace);
      if (!location) {
        return NextResponse.json(
          { error: "出生地が見つかりませんでした。別の表記でお試しください。" },
          { status: 400 }
        );
      }
      lat = location.lat;
      lng = location.lng;
      locationName = location.name;
      timezone = location.timezone;
    } else {
      return NextResponse.json(
        { error: "出生地を指定してください" },
        { status: 400 }
      );
    }

    // 出生日時を構築
    const { year, month, day } = body.birthDate;
    const { hour, minute, isKnown } = body.birthTime;
    
    const datetime = new Date(
      year,
      month - 1,
      day,
      isKnown ? hour : 12,
      isKnown ? minute : 0
    );

    const birthData: BirthData = {
      datetime: datetime.toISOString(),
      timezone,
      location: {
        lat,
        lng,
        name: locationName,
      },
      isTimeKnown: isKnown,
    };

    // ホロスコープを計算
    const chartData = calculateHoroscope(birthData);

    // エレメントパターンを計算（惑星とポイント両方を使用）
    const elementPattern = calculateElementPattern(chartData.planets, chartData.points);

    // チャートデータをAI用テキストに変換
    const chartText = formatChartDataForAI(chartData);

    // AI解説を生成
    const style = body.style || "neutral";
    const reading = await generateBasicReading(chartText, style);

    if (!reading) {
      return NextResponse.json(
        { error: "解説の生成に失敗しました。しばらく経ってから再度お試しください。" },
        { status: 500 }
      );
    }

    // データベースに保存
    const savedReading = await createReading({
      chart_data: chartData,
      basic_reading: reading,
      element_pattern: elementPattern,
      style,
    });

    if (!savedReading) {
      return NextResponse.json(
        { error: "データの保存に失敗しました" },
        { status: 500 }
      );
    }

    // レスポンス
    return NextResponse.json({
      id: savedReading.id,
      reading,
    });

  } catch (error) {
    console.error("Calculate API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
