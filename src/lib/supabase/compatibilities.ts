import { createServiceClient } from "./server";
import type { CompatibilityInsert, CompatibilityRow } from "@/types/database";
import type { CompatibilityReading } from "@/types/horoscope";

/**
 * 相性診断結果を保存
 */
export async function saveCompatibility(
  data: Omit<CompatibilityInsert, "id" | "created_at">
): Promise<{ id: string } | null> {
  const supabase = createServiceClient();

  const { data: result, error } = await supabase
    .from("compatibilities")
    .insert(data as CompatibilityInsert)
    .select("id")
    .single();

  if (error) {
    console.error("Error saving compatibility:", error);
    return null;
  }

  return result;
}

/**
 * IDで相性診断結果を取得
 */
export async function getCompatibilityById(
  id: string
): Promise<CompatibilityRow | null> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("compatibilities")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching compatibility:", error);
    return null;
  }

  return data as CompatibilityRow;
}

/**
 * 相性診断の決済状態を更新
 */
export async function markCompatibilityAsPaid(id: string): Promise<boolean> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("compatibilities")
    .update({ is_paid: true } as never)
    .eq("id", id);

  if (error) {
    console.error("Error marking compatibility as paid:", error);
    return false;
  }

  return true;
}

/**
 * 相性診断の結果を更新
 */
export async function updateCompatibilityReading(
  id: string,
  compatibilityReading: CompatibilityReading,
  score: number,
  catchphrase: string
): Promise<boolean> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("compatibilities")
    .update({
      compatibility_reading: compatibilityReading,
      score,
      catchphrase,
    } as never)
    .eq("id", id);

  if (error) {
    console.error("Error updating compatibility reading:", error);
    return false;
  }

  return true;
}
