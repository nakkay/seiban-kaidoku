// ========================================
// 環境変数の型安全なアクセス
// ========================================

// クライアントサイドで使用可能な環境変数
export const clientEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
} as const;

// サーバーサイドでのみ使用可能な環境変数
export const serverEnv = {
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  openaiApiKey: process.env.OPENAI_API_KEY!,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  opencageApiKey: process.env.OPENCAGE_API_KEY!,
  rateLimitPerHour: parseInt(process.env.RATE_LIMIT_PER_HOUR || "5", 10),
} as const;

// 互換性のためのエイリアス
export const env = {
  ...serverEnv,
  STRIPE_SECRET_KEY: serverEnv.stripeSecretKey,
  STRIPE_WEBHOOK_SECRET: serverEnv.stripeWebhookSecret,
};

// 環境変数の検証（サーバーサイド起動時に呼び出す）
export function validateEnv() {
  const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "OPENAI_API_KEY",
    "STRIPE_SECRET_KEY",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "OPENCAGE_API_KEY",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
}

