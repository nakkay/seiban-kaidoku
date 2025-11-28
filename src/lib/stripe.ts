import Stripe from "stripe";
import { env } from "./env";

// Stripeクライアント（サーバーサイド用）
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});

// 価格設定
export const PRICE = {
  amount: 500, // 500円
  currency: "jpy",
  productName: "星盤解読 - 詳細解説",
  productDescription: "18項目の詳細な占星術解説（恋愛編・未来編含む）",
};

/**
 * Stripe Checkoutセッションを作成
 */
export async function createCheckoutSession(
  readingId: string,
  baseUrl: string
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: PRICE.currency,
          product_data: {
            name: PRICE.productName,
            description: PRICE.productDescription,
          },
          unit_amount: PRICE.amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${baseUrl}/result/${readingId}/premium?paid=1`,
    cancel_url: `${baseUrl}/result/${readingId}`,
    metadata: {
      reading_id: readingId,
    },
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  return session.url;
}

/**
 * Stripe Webhookイベントを検証
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );
}

