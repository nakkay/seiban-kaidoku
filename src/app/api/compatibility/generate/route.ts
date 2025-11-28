import { NextRequest, NextResponse } from "next/server";
import { generateCompatibilityReading } from "@/lib/openai";
import { formatChartDataForAI } from "@/lib/horoscope";
import { getReadingById } from "@/lib/supabase";
import { getCompatibilityById, updateCompatibilityReading } from "@/lib/supabase/compatibilities";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { compatibilityId } = body;

    if (!compatibilityId) {
      return NextResponse.json(
        { error: "相性診断IDが不足しています" },
        { status: 400 }
      );
    }

    // 相性診断データを取得
    const compatibility = await getCompatibilityById(compatibilityId);
    if (!compatibility) {
      return NextResponse.json(
        { error: "相性診断データが見つかりませんでした" },
        { status: 404 }
      );
    }

    // 決済確認
    if (!compatibility.is_paid) {
      return NextResponse.json(
        { error: "決済が完了していません" },
        { status: 403 }
      );
    }

    // 既に生成済みの場合はスキップ
    if (compatibility.compatibility_reading) {
      return NextResponse.json({
        success: true,
        alreadyGenerated: true,
        compatibilityReading: compatibility.compatibility_reading,
      });
    }

    // Person 1のチャートデータを取得
    const person1Reading = await getReadingById(compatibility.person1_reading_id);
    if (!person1Reading) {
      return NextResponse.json(
        { error: "あなたの診断結果が見つかりませんでした" },
        { status: 404 }
      );
    }

    // チャートデータをAI用テキストに変換
    const person1ChartText = formatChartDataForAI(person1Reading.chart_data);
    const person2ChartText = formatChartDataForAI(compatibility.person2_chart_data);

    // 相性診断を生成
    const compatibilityReading = await generateCompatibilityReading(person1ChartText, person2ChartText);

    if (!compatibilityReading) {
      return NextResponse.json(
        { error: "相性診断の生成に失敗しました。しばらく経ってから再度お試しください。" },
        { status: 500 }
      );
    }

    // データベースを更新
    const updated = await updateCompatibilityReading(
      compatibilityId,
      compatibilityReading,
      compatibilityReading.hero.score,
      compatibilityReading.hero.catchphrase
    );

    if (!updated) {
      return NextResponse.json(
        { error: "データの保存に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      compatibilityReading,
    });

  } catch (error) {
    console.error("Compatibility generate API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

