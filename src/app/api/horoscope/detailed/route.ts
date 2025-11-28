import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { addDetailedReading } from "@/lib/supabase";
import { generateDetailedReading } from "@/lib/openai";
import { formatChartDataForAI } from "@/lib/horoscope";

// キャッシュを完全に無効化
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface DetailedRequest {
  id: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ReadingRow = any;

export async function POST(request: NextRequest) {
  try {
    const body: DetailedRequest = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "IDが指定されていません" },
        { status: 400 }
      );
    }

    // 毎回新しいクライアントを作成してキャッシュを回避
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // データベースから取得（キャッシュなし）
    const { data: reading, error } = await supabase
      .from("readings")
      .select("*")
      .eq("id", id)
      .single<ReadingRow>();

    if (error || !reading) {
      return NextResponse.json(
        { error: "結果が見つかりませんでした" },
        { status: 404 }
      );
    }

    // 支払い済みかチェック
    if (!reading.is_paid) {
      return NextResponse.json(
        { error: "詳細解説を見るには決済が必要です" },
        { status: 403 }
      );
    }

    // すでに詳細解説が生成されている場合はそれを返す
    if (reading.detailed_reading) {
      return NextResponse.json({
        reading: reading.detailed_reading,
      });
    }

    // チャートデータをAI用テキストに変換
    const chartText = formatChartDataForAI(reading.chart_data);

    // 詳細解説を生成
    const detailedReading = await generateDetailedReading(chartText);

    if (!detailedReading) {
      return NextResponse.json(
        { error: "詳細解説の生成に失敗しました" },
        { status: 500 }
      );
    }

    if (!detailedReading.sections || detailedReading.sections.length === 0) {
      return NextResponse.json(
        { error: "詳細解説の生成に失敗しました（sections が空）" },
        { status: 500 }
      );
    }

    // データベースに保存
    const saved = await addDetailedReading(id, detailedReading);

    if (!saved) {
      return NextResponse.json(
        { error: "データの保存に失敗しました" },
        { status: 500 }
      );
    }

    // レスポンス
    return NextResponse.json({
      reading: detailedReading,
    });

  } catch (error) {
    console.error("Detailed reading API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

