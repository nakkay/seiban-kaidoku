import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// キャッシュを完全に無効化
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface RouteParams {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "IDが指定されていません" },
        { status: 400 }
      );
    }

    // 毎回新しいクライアントを作成してキャッシュを回避
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // データベースから取得（キャッシュなし）
    const { data: reading, error: _error } = await supabase
      .from("readings")
      .select("*")
      .eq("id", id)
      .single();

    if (!reading) {
      return NextResponse.json(
        { error: "結果が見つかりませんでした" },
        { status: 404 }
      );
    }

    // レスポンス
    return NextResponse.json({
      id: reading.id,
      reading: reading.basic_reading,
      detailedReading: reading.detailed_reading,
      elementPattern: reading.element_pattern,
      isPaid: reading.is_paid,
      createdAt: reading.created_at,
    });

  } catch {
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

