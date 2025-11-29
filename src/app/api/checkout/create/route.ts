import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";
import { getReadingById } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { readingId } = body;

    if (!readingId) {
      return NextResponse.json(
        { error: "読み取りIDが必要です" },
        { status: 400 }
      );
    }

    // 結果が存在するか確認
    const reading = await getReadingById(readingId);
    if (!reading) {
      return NextResponse.json(
        { error: "結果が見つかりません" },
        { status: 404 }
      );
    }

    // すでに支払い済みの場合
    if (reading.is_paid) {
      return NextResponse.json(
        { error: "すでに購入済みです", alreadyPaid: true },
        { status: 400 }
      );
    }

    // ベースURLを取得
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
      `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`;

    // Stripe Checkoutセッションを作成
    const checkoutUrl = await createCheckoutSession(readingId, baseUrl);

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: "決済セッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}




