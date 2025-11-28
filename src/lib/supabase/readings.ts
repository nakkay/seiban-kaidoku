/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";
import type { ReadingInsert, ReadingUpdate, ReadingRow } from "@/types/database";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * 新しい結果を保存
 */
export async function createReading(data: ReadingInsert): Promise<ReadingRow | null> {
  const supabase = getSupabase();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: reading, error } = await supabase
    .from("readings")
    .insert(data as any)
    .select()
    .single();

  if (error) {
    return null;
  }

  return reading as ReadingRow;
}

/**
 * IDで結果を取得
 */
export async function getReadingById(id: string): Promise<ReadingRow | null> {
  const supabase = getSupabase();
  
  const { data: reading, error } = await supabase
    .from("readings")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return reading as ReadingRow;
}

/**
 * 結果を更新（主に決済完了時の is_paid 更新と詳細解説追加）
 */
export async function updateReading(
  id: string,
  data: ReadingUpdate
): Promise<ReadingRow | null> {
  const supabase = getSupabase();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: reading, error } = await supabase
    .from("readings")
    .update(data as any)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return null;
  }

  return reading as ReadingRow;
}

/**
 * 支払い済みに更新
 */
export async function markReadingAsPaid(id: string): Promise<boolean> {
  const supabase = getSupabase();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase
    .from("readings")
    .update({ is_paid: true } as any)
    .eq("id", id);

  if (error) {
    return false;
  }

  return true;
}

/**
 * 支払いステータスを更新（Webhook用エイリアス）
 */
export async function updateReadingPaidStatus(id: string, isPaid: boolean): Promise<boolean> {
  const supabase = getSupabase();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase
    .from("readings")
    .update({ is_paid: isPaid } as any)
    .eq("id", id);

  if (error) {
    return false;
  }

  return true;
}

/**
 * 詳細解説を追加
 */
export async function addDetailedReading(
  id: string,
  detailedReading: ReadingRow["detailed_reading"]
): Promise<boolean> {
  const supabase = getSupabase();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await supabase
    .from("readings")
    .update({ detailed_reading: detailedReading } as any)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return false;
  }

  return true;
}
