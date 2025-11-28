import { NextRequest, NextResponse } from "next/server";
import { getCompatibilityById, markCompatibilityAsPaid } from "@/lib/supabase/compatibilities";

export const dynamic = "force-dynamic";

/**
 * ローカルテスト用: 相性診断の決済状態を更新
 * 本番ではStripe Webhookで処理される
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 相性診断を取得
    const compatibility = await getCompatibilityById(id);

    if (!compatibility) {
      return NextResponse.json(
        { error: "相性診断が見つかりませんでした" },
        { status: 404 }
      );
    }

    // 既に支払い済みの場合
    if (compatibility.is_paid) {
      return NextResponse.json({
        success: true,
        message: "既に支払い済みです",
        is_paid: true,
      });
    }

    // 支払い状態を更新
    const success = await markCompatibilityAsPaid(id);

    if (!success) {
      return NextResponse.json(
        { error: "支払い状態の更新に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "支払い状態を更新しました",
      is_paid: true,
    });
  } catch (error) {
    console.error("Error marking compatibility as paid:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

