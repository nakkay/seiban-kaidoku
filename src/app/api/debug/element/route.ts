import { NextRequest, NextResponse } from "next/server";
import { calculateHoroscope, calculateElementPattern } from "@/lib/horoscope/calculator";
import { ZODIAC_SIGNS } from "@/constants/zodiac";
import type { BirthData } from "@/types";

/**
 * デバッグ用API: エレメント計算の詳細を確認
 * 
 * POST /api/debug/element
 * Body: { year, month, day, hour, minute, lat, lng }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { year, month, day, hour, minute, lat, lng } = body;

    // 出生日時を構築
    const datetime = new Date(year, month - 1, day, hour, minute);

    const birthData: BirthData = {
      datetime: datetime.toISOString(),
      timezone: "Asia/Tokyo",
      location: { lat, lng, name: "Debug" },
      isTimeKnown: true,
    };

    // ホロスコープを計算
    const chartData = calculateHoroscope(birthData);

    // 配点テーブル
    const pointValues: Record<string, number> = {
      sun: 4,
      moon: 4,
      asc: 4,
      mc: 4,
      mercury: 3,
      venus: 3,
      mars: 3,
      jupiter: 2,
      saturn: 2,
      uranus: 1,
      neptune: 1,
      pluto: 1,
    };

    // 各惑星の詳細
    const planetDetails = chartData.planets.map((planet) => {
      const signData = ZODIAC_SIGNS[planet.sign];
      return {
        name: planet.name,
        sign: planet.sign,
        signJa: signData?.ja,
        element: signData?.element,
        points: pointValues[planet.name] || 0,
      };
    });

    // ASC/MCの詳細
    const pointDetails = chartData.points
      .filter((p) => p.name === "asc" || p.name === "mc")
      .map((point) => {
        const signData = ZODIAC_SIGNS[point.sign];
        return {
          name: point.name,
          sign: point.sign,
          signJa: signData?.ja,
          element: signData?.element,
          points: pointValues[point.name] || 0,
        };
      });

    // エレメントごとの集計
    const counts = { fire: 0, earth: 0, air: 0, water: 0 };
    
    for (const planet of planetDetails) {
      if (planet.element && planet.points > 0) {
        counts[planet.element as keyof typeof counts] += planet.points;
      }
    }
    
    for (const point of pointDetails) {
      if (point.element && point.points > 0) {
        counts[point.element as keyof typeof counts] += point.points;
      }
    }

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    // 割合を計算
    const percentages = Object.entries(counts)
      .map(([element, count]) => ({
        element,
        count,
        percentage: Math.round((count / total) * 1000) / 10, // パーセント表示
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // 最終判定
    const elementPattern = calculateElementPattern(chartData.planets, chartData.points);

    return NextResponse.json({
      input: { year, month, day, hour, minute, lat, lng },
      planetDetails,
      pointDetails,
      counts,
      total,
      percentages,
      elementPattern,
      判定ロジック: {
        単体型: "1位 >= 45% かつ (1位 - 2位) >= 15%",
        "2タイプ複合型": "(1位 + 2位) >= 70% かつ (2位 - 3位) >= 10%",
        "3タイプ複合型": "(1位 + 2位 + 3位) >= 85% かつ (3位 - 4位) >= 5%",
        "4要素混合型": "それ以外",
      },
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

