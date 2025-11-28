import { NextRequest, NextResponse } from "next/server";
import { getCompatibilityById } from "@/lib/supabase/compatibilities";
import { getReadingById } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RouteParams {
  params: { id: string };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "IDが指定されていません" },
        { status: 400 }
      );
    }

    // 相性診断結果を取得
    const compatibility = await getCompatibilityById(id);

    if (!compatibility) {
      return NextResponse.json(
        { error: "相性診断結果が見つかりませんでした" },
        { status: 404 }
      );
    }

    // Person 1の情報を取得
    const person1Reading = await getReadingById(compatibility.person1_reading_id);
    
    if (!person1Reading) {
      return NextResponse.json(
        { error: "関連する診断結果が見つかりませんでした" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: compatibility.id,
      person1ReadingId: compatibility.person1_reading_id,
      person1: {
        zodiacSign: person1Reading.basic_reading.hero.zodiacSign,
        elementTitle: person1Reading.basic_reading.hero.elementTitle,
        catchphrase: person1Reading.basic_reading.hero.catchphrase,
        elementPattern: person1Reading.element_pattern,
      },
      person2: {
        zodiac: compatibility.person2_zodiac,
        element: compatibility.person2_element,
        elementPattern: compatibility.person2_element_pattern,
        catchphrase: compatibility.person2_catchphrase,
      },
      score: compatibility.score,
      catchphrase: compatibility.catchphrase,
      reading: compatibility.compatibility_reading,
      isPaid: compatibility.is_paid,
      createdAt: compatibility.created_at,
    });

  } catch (error) {
    console.error("Get compatibility API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

