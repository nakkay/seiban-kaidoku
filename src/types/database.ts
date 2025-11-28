import type { ChartData, Reading, ElementPattern, ReadingStyle, CompatibilityReading } from "./horoscope";

/**
 * Supabase Database型定義
 */
export type Database = {
  public: {
    Tables: {
      readings: {
        Row: {
          id: string;
          chart_data: ChartData;
          basic_reading: Reading;
          detailed_reading: Reading | null;
          element_pattern: ElementPattern;
          style: ReadingStyle;
          is_paid: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          chart_data: ChartData;
          basic_reading: Reading;
          detailed_reading?: Reading | null;
          element_pattern: ElementPattern;
          style: ReadingStyle;
          is_paid?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          chart_data?: ChartData;
          basic_reading?: Reading;
          detailed_reading?: Reading | null;
          element_pattern?: ElementPattern;
          style?: ReadingStyle;
          is_paid?: boolean;
          created_at?: string;
        };
      };
      compatibilities: {
        Row: {
          id: string;
          person1_reading_id: string;
          person2_chart_data: ChartData;
          person2_zodiac: string;
          person2_element: string;
          person2_element_pattern: ElementPattern;
          person2_catchphrase: string;
          score: number;
          catchphrase: string;
          compatibility_reading: CompatibilityReading | null;
          is_paid: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          person1_reading_id: string;
          person2_chart_data: ChartData;
          person2_zodiac: string;
          person2_element: string;
          person2_element_pattern: ElementPattern;
          person2_catchphrase: string;
          score: number;
          catchphrase: string;
          compatibility_reading: CompatibilityReading | null;
          is_paid?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          person1_reading_id?: string;
          person2_chart_data?: ChartData;
          person2_zodiac?: string;
          person2_element?: string;
          person2_element_pattern?: ElementPattern;
          person2_catchphrase?: string;
          score?: number;
          catchphrase?: string;
          compatibility_reading?: CompatibilityReading | null;
          is_paid?: boolean;
          created_at?: string;
        };
      };
      rate_limits: {
        Row: {
          ip_hash: string;
          count: number;
          window_start: string;
        };
        Insert: {
          ip_hash: string;
          count?: number;
          window_start?: string;
        };
        Update: {
          ip_hash?: string;
          count?: number;
          window_start?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// 便利な型エイリアス
export type ReadingRow = Database["public"]["Tables"]["readings"]["Row"];
export type ReadingInsert = Database["public"]["Tables"]["readings"]["Insert"];
export type ReadingUpdate = Database["public"]["Tables"]["readings"]["Update"];

export type CompatibilityRow = Database["public"]["Tables"]["compatibilities"]["Row"];
export type CompatibilityInsert = Database["public"]["Tables"]["compatibilities"]["Insert"];
export type CompatibilityUpdate = Database["public"]["Tables"]["compatibilities"]["Update"];

export type RateLimitRow = Database["public"]["Tables"]["rate_limits"]["Row"];
export type RateLimitInsert = Database["public"]["Tables"]["rate_limits"]["Insert"];
export type RateLimitUpdate = Database["public"]["Tables"]["rate_limits"]["Update"];

