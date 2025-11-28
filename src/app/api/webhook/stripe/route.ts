import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { updateReadingPaidStatus } from "@/lib/supabase/readings";
import { markCompatibilityAsPaid } from "@/lib/supabase/compatibilities";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "署名がありません" },
        { status: 400 }
      );
    }

    // Webhookイベントを検証
    let event: Stripe.Event;
    try {
      event = constructWebhookEvent(body, signature);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json(
        { error: "署名の検証に失敗しました" },
        { status: 400 }
      );
    }

    // checkout.session.completed イベントを処理
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentType = session.metadata?.type;

      if (paymentType === "compatibility") {
        // 相性診断の決済完了
        const compatibilityId = session.metadata?.compatibility_id;
        if (compatibilityId) {
          const success = await markCompatibilityAsPaid(compatibilityId);
          if (!success) {
            console.error("Failed to update compatibility paid status:", compatibilityId);
          }
        }
      } else {
        // 詳細解説の決済完了
        const readingId = session.metadata?.reading_id;
        if (readingId) {
          const success = await updateReadingPaidStatus(readingId, true);
          if (!success) {
            console.error("Failed to update reading paid status:", readingId);
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhookの処理に失敗しました" },
      { status: 500 }
    );
  }
}


