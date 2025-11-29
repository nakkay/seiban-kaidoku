import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

/**
 * ブラウザ用Supabaseクライアント
 * クライアントコンポーネントで使用
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}



