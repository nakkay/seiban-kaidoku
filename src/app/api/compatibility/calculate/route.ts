import { NextRequest, NextResponse } from "next/server";
import { getLocation } from "@/lib/opencage";
import { calculateHoroscope, calculateElementPattern } from "@/lib/horoscope";
import { getReadingById } from "@/lib/supabase";
import { saveCompatibility } from "@/lib/supabase/compatibilities";
import { stripe } from "@/lib/stripe";
import type { BirthData, ZodiacSign } from "@/types";

interface CompatibilityCalculateRequest {
  person1ReadingId: string;
  person2: {
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
  };
}

// 星座から日本語名を取得
const zodiacToJapanese: Record<ZodiacSign, string> = {
  aries: "牡羊座",
  taurus: "牡牛座",
  gemini: "双子座",
  cancer: "蟹座",
  leo: "獅子座",
  virgo: "乙女座",
  libra: "天秤座",
  scorpio: "蠍座",
  sagittarius: "射手座",
  capricorn: "山羊座",
  aquarius: "水瓶座",
  pisces: "魚座",
};

// 星座からエレメントを取得
const zodiacToElement: Record<ZodiacSign, string> = {
  aries: "fire",
  taurus: "earth",
  gemini: "air",
  cancer: "water",
  leo: "fire",
  virgo: "earth",
  libra: "air",
  scorpio: "water",
  sagittarius: "fire",
  capricorn: "earth",
  aquarius: "air",
  pisces: "water",
};

export async function POST(request: NextRequest) {
  try {
    const body: CompatibilityCalculateRequest = await request.json();

    // バリデーション
    if (!body.person1ReadingId) {
      return NextResponse.json(
        { error: "あなたの診断結果IDが不足しています" },
        { status: 400 }
      );
    }

    if (!body.person2?.birthDate) {
      return NextResponse.json(
        { error: "相手の生年月日が不足しています" },
        { status: 400 }
      );
    }

    // Person 1のデータを取得
    const person1Reading = await getReadingById(body.person1ReadingId);
    if (!person1Reading) {
      return NextResponse.json(
        { error: "あなたの診断結果が見つかりませんでした" },
        { status: 404 }
      );
    }

    // Person 2の緯度経度を決定
    let lat: number;
    let lng: number;
    let locationName: string;
    let timezone: string;

    if (body.person2.latitude !== undefined && body.person2.longitude !== undefined) {
      lat = body.person2.latitude;
      lng = body.person2.longitude;
      locationName = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      timezone = (lng > 120 && lng < 150 && lat > 20 && lat < 50) ? "Asia/Tokyo" : "UTC";
    } else if (body.person2.birthPlace) {
      const location = await getLocation(body.person2.birthPlace);
      if (!location) {
        return NextResponse.json(
          { error: "相手の出生地が見つかりませんでした" },
          { status: 400 }
        );
      }
      lat = location.lat;
      lng = location.lng;
      locationName = location.name;
      timezone = location.timezone;
    } else {
      return NextResponse.json(
        { error: "相手の出生地を指定してください" },
        { status: 400 }
      );
    }

    // Person 2の出生日時を構築
    const { year, month, day } = body.person2.birthDate;
    const { hour, minute, isKnown } = body.person2.birthTime || { hour: 12, minute: 0, isKnown: false };

    const datetime = new Date(
      year,
      month - 1,
      day,
      isKnown ? hour : 12,
      isKnown ? minute : 0
    );

    const person2BirthData: BirthData = {
      datetime: datetime.toISOString(),
      timezone,
      location: {
        lat,
        lng,
        name: locationName,
      },
      isTimeKnown: isKnown,
    };

    // Person 2のホロスコープを計算
    const person2ChartData = calculateHoroscope(person2BirthData);
    const person2ElementPattern = calculateElementPattern(person2ChartData.planets, person2ChartData.points);

    // Person 2の太陽星座を取得
    const sunPlanet = person2ChartData.planets.find(p => p.name === "sun");
    const person2Zodiac = sunPlanet?.sign || "aries";
    const person2Element = zodiacToElement[person2Zodiac];

    // Person 2のキャッチフレーズを生成（簡易版）
    const elementDescriptions: Record<string, string[]> = {
      fire: ["情熱的な行動の人", "燃える魂の持ち主", "輝きを放つ先導者"],
      earth: ["確かな基盤の人", "揺るがぬ信念の守護者", "実りをもたらす人"],
      air: ["自由な発想の人", "風のように軽やかな知性", "広がる可能性の探求者"],
      water: ["深い感情の人", "直感に導かれる魂", "心の奥底を読み解く人"],
    };
    const catchphrases = elementDescriptions[person2Element] || elementDescriptions.fire;
    const person2Catchphrase = catchphrases[Math.floor(Math.random() * catchphrases.length)];

    // データベースに保存（AI生成は決済後に行う）
    // compatibility_readingとscoreは仮の値を入れる
    const savedCompatibility = await saveCompatibility({
      person1_reading_id: body.person1ReadingId,
      person2_chart_data: person2ChartData,
      person2_zodiac: person2Zodiac,
      person2_element: person2Element,
      person2_element_pattern: person2ElementPattern,
      person2_catchphrase: person2Catchphrase,
      score: 0, // 仮の値、AI生成後に更新
      catchphrase: "診断生成中...", // 仮の値、AI生成後に更新
      compatibility_reading: null, // AI生成後に更新
      is_paid: false, // 決済前
    });

    if (!savedCompatibility) {
      return NextResponse.json(
        { error: "データの保存に失敗しました" },
        { status: 500 }
      );
    }

    // Stripe Checkout Sessionを作成
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: "相性診断",
              description: "2人の星の相性を詳しく読み解きます",
            },
            unit_amount: 500,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/compatibility/${savedCompatibility.id}?paid=1`,
      cancel_url: `${appUrl}/result/${body.person1ReadingId}`,
      metadata: {
        compatibility_id: savedCompatibility.id,
        type: "compatibility",
      },
    });

    return NextResponse.json({
      id: savedCompatibility.id,
      checkoutUrl: session.url,
    });

  } catch (error) {
    console.error("Compatibility calculate API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}
