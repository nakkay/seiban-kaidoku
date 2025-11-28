// ========================================
// ホロスコープ関連の型定義
// ========================================

// 12星座
export type ZodiacSign =
  | "aries"      // 牡羊座
  | "taurus"     // 牡牛座
  | "gemini"     // 双子座
  | "cancer"     // 蟹座
  | "leo"        // 獅子座
  | "virgo"      // 乙女座
  | "libra"      // 天秤座
  | "scorpio"    // 蠍座
  | "sagittarius" // 射手座
  | "capricorn"  // 山羊座
  | "aquarius"   // 水瓶座
  | "pisces";    // 魚座

// 日本語星座名
export type ZodiacSignJa =
  | "牡羊座"
  | "牡牛座"
  | "双子座"
  | "蟹座"
  | "獅子座"
  | "乙女座"
  | "天秤座"
  | "蠍座"
  | "射手座"
  | "山羊座"
  | "水瓶座"
  | "魚座";

// エレメント（四大元素）
export type Element = "fire" | "earth" | "air" | "water";
export type ElementJa = "火" | "地" | "風" | "水";

// 惑星名
export type PlanetName =
  | "sun"       // 太陽
  | "moon"      // 月
  | "mercury"   // 水星
  | "venus"     // 金星
  | "mars"      // 火星
  | "jupiter"   // 木星
  | "saturn"    // 土星
  | "uranus"    // 天王星
  | "neptune"   // 海王星
  | "pluto";    // 冥王星

// 感受点名
export type PointName =
  | "asc"        // アセンダント
  | "mc"         // ミッドヘブン
  | "northNode"  // ノースノード
  | "chiron"     // キロン
  | "lilith"     // リリス
  | "fortune"    // パート・オブ・フォーチュン
  | "vertex";    // バーテックス

// アスペクトタイプ
export type AspectType =
  | "conjunction"     // コンジャンクション（0°）
  | "opposition"      // オポジション（180°）
  | "trine"           // トライン（120°）
  | "square"          // スクエア（90°）
  | "sextile"         // セクスタイル（60°）
  | "semisextile"     // セミセクスタイル（30°）
  | "semisquare"      // セミスクエア（45°）
  | "quintile"        // クインタイル（72°）
  | "sesquiquadrate"  // セスキコードレート（135°）
  | "biquintile"      // バイクインタイル（144°）
  | "quincunx";       // クインカンクス（150°）

// 解説スタイル
export type ReadingStyle = "praise" | "neutral" | "strict";

// ========================================
// データ構造
// ========================================

// 惑星データ
export interface Planet {
  name: PlanetName;
  sign: ZodiacSign;
  degree: number;
  house: number;
  retrograde: boolean;
}

// 感受点データ
export interface Point {
  name: PointName;
  sign: ZodiacSign;
  degree: number;
  house?: number;
}

// ハウスデータ
export interface House {
  number: number; // 1-12
  sign: ZodiacSign;
  degree: number;
}

// アスペクトデータ
export interface Aspect {
  planet1: PlanetName | PointName;
  planet2: PlanetName | PointName;
  type: AspectType;
  angle: number;
  orb: number;
  applying: boolean; // 接近中かどうか
}

// 出生地データ
export interface Location {
  lat: number;
  lng: number;
  name: string;
}

// 出生データ
export interface BirthData {
  datetime: string; // ISO 8601 format
  timezone: string;
  location: Location;
  isTimeKnown: boolean;
}

// チャートデータ（計算結果）
export interface ChartData {
  birthData: BirthData;
  planets: Planet[];
  points: Point[];
  houses: House[];
  aspects: Aspect[];
}

// ========================================
// AI解説の出力形式
// ========================================

// ヒーローセクション
export interface HeroSection {
  zodiacSign: ZodiacSignJa;
  element: ElementJa;
  elementTitle: string; // "水の刻印" など
  catchphrase: string;  // "深海に潜む直感の人" など
}

// 解説セクション
export interface ReadingSection {
  id: number;
  title: string;
  icon: string;
  catch: string;
  tendency: string | null;
  keyPointsTitle: string;
  keyPoints: string[];
  description: string;
}

// AI解説結果
export interface Reading {
  hero: HeroSection;
  sections: ReadingSection[];
}

// ========================================
// API リクエスト・レスポンス
// ========================================

// 入力フォームデータ
export interface BirthInputData {
  birthDate: {
    year: number;
    month: number;
    day: number;
  };
  birthTime: {
    hour: number;
    minute: number;
    isKnown: boolean;
  };
  birthPlace: string;
  style: ReadingStyle;
}

// 計算API レスポンス
export interface CalculateResponse {
  id: string;
  reading: Reading;
}

// 結果取得API レスポンス
export interface ResultResponse {
  id: string;
  reading: Reading;
  isPaid: boolean;
  createdAt: string;
  detailedReading?: Reading;
}

// Checkout API レスポンス
export interface CheckoutResponse {
  checkoutUrl: string;
}

// 詳細解説API レスポンス
export interface DetailedReadingResponse {
  reading: Reading;
}

// ========================================
// 相性診断関連
// ========================================

// 相性診断のヒーローセクション
export interface CompatibilityHeroSection {
  person1: {
    zodiacSign: ZodiacSignJa;
    elementTitle: string;
    catchphrase: string;
  };
  person2: {
    zodiacSign: ZodiacSignJa;
    elementTitle: string;
    catchphrase: string;
  };
  score: number;
  catchphrase: string;
}

// 相性診断セクション
export interface CompatibilitySection {
  id: number;
  title: string;
  icon: string;
  catch: string;
  keyPointsTitle: string;
  keyPoints: string[];
  description: string;
  isCaution?: boolean; // 衝突ポイントの場合true
}

// 相性診断結果
export interface CompatibilityReading {
  hero: CompatibilityHeroSection;
  sections: CompatibilitySection[];
}

// 相性診断計算APIリクエスト
export interface CompatibilityCalculateRequest {
  person1ReadingId: string;
  person2: {
    birthDate: {
      year: number;
      month: number;
      day: number;
    };
    birthTime: {
      hour: number;
      minute: number;
      isKnown: boolean;
    };
    birthPlace: string;
  };
}

// 相性診断計算APIレスポンス
export interface CompatibilityCalculateResponse {
  id: string;
  checkoutUrl: string;
}

// 相性診断結果取得APIレスポンス
export interface CompatibilityResultResponse {
  id: string;
  person1ReadingId: string;
  reading: CompatibilityReading;
  createdAt: string;
}

// エレメントパターン（背景選択用）
export type ElementPattern =
  | "fire"
  | "earth"
  | "air"
  | "water"
  | "fire-earth"
  | "fire-air"
  | "fire-water"
  | "earth-air"
  | "earth-water"
  | "air-water"
  | "fire-earth-air"
  | "fire-earth-water"
  | "fire-air-water"
  | "earth-air-water"
  | "balanced";

