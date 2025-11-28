import { createClient } from "@supabase/supabase-js";
import { hashString } from "@/lib/utils";
import type { RateLimitRow, RateLimitInsert, RateLimitUpdate } from "@/types/database";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const DEFAULT_LIMIT = 5; // 1時間あたりの制限
const DEFAULT_WINDOW_HOURS = 1;

/**
 * レート制限をチェック
 * @param ip IPアドレス
 * @param limit 制限回数（デフォルト: 5）
 * @param windowHours ウィンドウ時間（デフォルト: 1時間）
 * @returns true: 許可, false: 制限超過
 */
export async function checkRateLimit(
  ip: string,
  limit: number = DEFAULT_LIMIT,
  windowHours: number = DEFAULT_WINDOW_HOURS
): Promise<boolean> {
  const supabase = getSupabase();
  
  // IPアドレスをハッシュ化（プライバシー保護）
  const ipHash = await hashString(ip);
  
  const windowMs = windowHours * 60 * 60 * 1000;
  const windowStart = new Date(Date.now() - windowMs);
  
  try {
    // 現在のレート制限レコードを取得
    const { data, error: selectError } = await supabase
      .from("rate_limits")
      .select("count, window_start")
      .eq("ip_hash", ipHash)
      .single();
    
    const existingRecord = data as RateLimitRow | null;

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 = row not found, それ以外はエラー
      console.error("Error checking rate limit:", selectError);
      return true; // エラー時は許可
    }

    if (!existingRecord) {
      // 新規レコードを作成
      const insertData: RateLimitInsert = {
        ip_hash: ipHash,
        count: 1,
        window_start: new Date().toISOString(),
      };
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await supabase
        .from("rate_limits")
        .insert(insertData as any);

      if (insertError) {
        console.error("Error creating rate limit record:", insertError);
        return true;
      }
      return true;
    }

    const recordWindowStart = new Date(existingRecord.window_start);

    // ウィンドウが期限切れの場合はリセット
    if (recordWindowStart < windowStart) {
      const updateData: RateLimitUpdate = {
        count: 1,
        window_start: new Date().toISOString(),
      };
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: updateError } = await supabase
        .from("rate_limits")
        .update(updateData as any)
        .eq("ip_hash", ipHash);

      if (updateError) {
        console.error("Error resetting rate limit:", updateError);
        return true;
      }
      return true;
    }

    // 制限を超えているかチェック
    if (existingRecord.count >= limit) {
      return false;
    }

    // カウントをインクリメント
    const incrementData: RateLimitUpdate = {
      count: existingRecord.count + 1,
    };
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: incrementError } = await supabase
      .from("rate_limits")
      .update(incrementData as any)
      .eq("ip_hash", ipHash);

    if (incrementError) {
      console.error("Error incrementing rate limit:", incrementError);
      return true;
    }

    return true;
  } catch (error) {
    console.error("Rate limit check error:", error);
    return true; // エラー時は許可（サービス継続性を優先）
  }
}

/**
 * 現在のレート制限状態を取得
 */
export async function getRateLimitStatus(ip: string): Promise<{
  count: number;
  remaining: number;
  resetAt: Date;
} | null> {
  const supabase = getSupabase();
  
  const ipHash = await hashString(ip);
  
  const { data, error } = await supabase
    .from("rate_limits")
    .select("count, window_start")
    .eq("ip_hash", ipHash)
    .single();
  
  const record = data as RateLimitRow | null;

  if (error || !record) {
    return {
      count: 0,
      remaining: DEFAULT_LIMIT,
      resetAt: new Date(Date.now() + DEFAULT_WINDOW_HOURS * 60 * 60 * 1000),
    };
  }

  const windowStart = new Date(record.window_start);
  const resetAt = new Date(
    windowStart.getTime() + DEFAULT_WINDOW_HOURS * 60 * 60 * 1000
  );

  return {
    count: record.count,
    remaining: Math.max(0, DEFAULT_LIMIT - record.count),
    resetAt,
  };
}
