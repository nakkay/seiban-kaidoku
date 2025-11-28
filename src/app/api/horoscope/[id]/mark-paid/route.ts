import { NextRequest, NextResponse } from "next/server";
import { markReadingAsPaid, getReadingById } from "@/lib/supabase";

/**
 * 決済完了時にis_paidをtrueに更新するエンドポイント
 * 
 * 注意: 本番環境ではStripe Webhookを使用してください。
 * このエンドポイントはローカル開発用の簡易版です。
 * 
 * 本番環境では、Stripeからリダイレクトされた際の?paid=1パラメータだけでなく、
 * Webhookで署名検証を行った上でis_paidを更新することが推奨されます。
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 結果が存在するか確認
    const reading = await getReadingById(id);
    if (!reading) {
      return NextResponse.json(
        { error: "結果が見つかりません" },
        { status: 404 }
      );
    }

    // すでに支払い済みの場合
    if (reading.is_paid) {
      return NextResponse.json({ success: true, alreadyPaid: true });
    }

    // is_paidを更新
    const success = await markReadingAsPaid(id);

    if (!success) {
      return NextResponse.json(
        { error: "更新に失敗しました" },
        { status: 500 }
      );
    }

    // 更新後のデータを確認
    const updatedReading = await getReadingById(id);

    return NextResponse.json({ success: true, isPaid: updatedReading?.is_paid });
  } catch {
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

