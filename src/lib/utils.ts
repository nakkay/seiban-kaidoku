import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSSのクラス名を結合するユーティリティ
 * clsxとtailwind-mergeを組み合わせて、重複するクラスを適切にマージ
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 度数を "XX°YY'" 形式にフォーマット
 */
export function formatDegree(degree: number): string {
  const degrees = Math.floor(degree);
  const minutes = Math.round((degree - degrees) * 60);
  return `${degrees}°${String(minutes).padStart(2, "0")}'`;
}

/**
 * 日付を日本語形式にフォーマット
 */
export function formatDateJa(date: Date): string {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 時刻を日本語形式にフォーマット
 */
export function formatTimeJa(hour: number, minute: number): string {
  return `${hour}時${String(minute).padStart(2, "0")}分`;
}

/**
 * 文字列のハッシュ化（IPアドレスなど）
 */
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * スリープ関数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * ランダムな文字列を生成
 */
export function generateRandomId(length: number = 12): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}





