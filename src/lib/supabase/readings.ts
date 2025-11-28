import { createServiceClient } from "./server";
import type { ReadingInsert, ReadingUpdate, ReadingRow } from "@/types/database";

/**
 * 新しい結果を保存
 */
export async function createReading(data: ReadingInsert): Promise<ReadingRow | null> {
  const supabase = createServiceClient();
  
  const { data: reading, error } = await supabase
    .from("readings")
    .insert(data as never)
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
  const supabase = createServiceClient();
  
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
  const supabase = createServiceClient();
  
  const { data: reading, error } = await supabase
    .from("readings")
    .update(data as never)
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
  const supabase = createServiceClient();
  
  const { error } = await supabase
    .from("readings")
    .update({ is_paid: true } as never)
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
  const supabase = createServiceClient();
  
  const { error } = await supabase
    .from("readings")
    .update({ is_paid: isPaid } as never)
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
  const supabase = createServiceClient();
  
  const { error } = await supabase
    .from("readings")
    .update({ detailed_reading: detailedReading } as never)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return false;
  }

  return true;
}
