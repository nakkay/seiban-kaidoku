import type {
  ZodiacSign,
  ZodiacSignJa,
  Element,
  ElementJa,
  PlanetName,
  PointName,
} from "@/types";

// ========================================
// 星座マッピング
// ========================================

export const ZODIAC_SIGNS: Record<
  ZodiacSign,
  { ja: ZodiacSignJa; symbol: string; element: Element }
> = {
  aries: { ja: "牡羊座", symbol: "♈", element: "fire" },
  taurus: { ja: "牡牛座", symbol: "♉", element: "earth" },
  gemini: { ja: "双子座", symbol: "♊", element: "air" },
  cancer: { ja: "蟹座", symbol: "♋", element: "water" },
  leo: { ja: "獅子座", symbol: "♌", element: "fire" },
  virgo: { ja: "乙女座", symbol: "♍", element: "earth" },
  libra: { ja: "天秤座", symbol: "♎", element: "air" },
  scorpio: { ja: "蠍座", symbol: "♏", element: "water" },
  sagittarius: { ja: "射手座", symbol: "♐", element: "fire" },
  capricorn: { ja: "山羊座", symbol: "♑", element: "earth" },
  aquarius: { ja: "水瓶座", symbol: "♒", element: "air" },
  pisces: { ja: "魚座", symbol: "♓", element: "water" },
};

// 星座の順序
export const ZODIAC_ORDER: ZodiacSign[] = [
  "aries",
  "taurus",
  "gemini",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "scorpio",
  "sagittarius",
  "capricorn",
  "aquarius",
  "pisces",
];

// ========================================
// エレメントマッピング
// ========================================

export const ELEMENTS: Record<Element, { ja: ElementJa; color: string }> = {
  fire: { ja: "火", color: "#e74c3c" },
  earth: { ja: "地", color: "#27ae60" },
  air: { ja: "風", color: "#3498db" },
  water: { ja: "水", color: "#9b59b6" },
};

// ========================================
// 惑星マッピング
// ========================================

export const PLANETS: Record<
  PlanetName,
  { ja: string; symbol: string; canRetrograde: boolean }
> = {
  sun: { ja: "太陽", symbol: "☉", canRetrograde: false },
  moon: { ja: "月", symbol: "☽", canRetrograde: false },
  mercury: { ja: "水星", symbol: "☿", canRetrograde: true },
  venus: { ja: "金星", symbol: "♀", canRetrograde: true },
  mars: { ja: "火星", symbol: "♂", canRetrograde: true },
  jupiter: { ja: "木星", symbol: "♃", canRetrograde: true },
  saturn: { ja: "土星", symbol: "♄", canRetrograde: true },
  uranus: { ja: "天王星", symbol: "♅", canRetrograde: true },
  neptune: { ja: "海王星", symbol: "♆", canRetrograde: true },
  pluto: { ja: "冥王星", symbol: "♇", canRetrograde: true },
};

// ========================================
// 感受点マッピング
// ========================================

export const POINTS: Record<PointName, { ja: string; symbol: string }> = {
  asc: { ja: "アセンダント", symbol: "Asc" },
  mc: { ja: "ミッドヘブン", symbol: "MC" },
  northNode: { ja: "ノースノード", symbol: "☊" },
  chiron: { ja: "キロン", symbol: "⚷" },
  lilith: { ja: "リリス", symbol: "⚸" },
  fortune: { ja: "パート・オブ・フォーチュン", symbol: "⊕" },
  vertex: { ja: "バーテックス", symbol: "Vx" },
};

// ========================================
// ハウスの意味
// ========================================

export const HOUSES: Record<number, { theme: string; keywords: string[] }> = {
  1: { theme: "自己・外見", keywords: ["個性", "第一印象", "身体"] },
  2: { theme: "所有・価値観", keywords: ["お金", "才能", "自己価値"] },
  3: { theme: "コミュニケーション", keywords: ["学習", "兄弟", "近隣"] },
  4: { theme: "家庭・ルーツ", keywords: ["家族", "住居", "心の基盤"] },
  5: { theme: "創造・恋愛", keywords: ["趣味", "子供", "自己表現"] },
  6: { theme: "労働・健康", keywords: ["仕事", "日常", "奉仕"] },
  7: { theme: "パートナーシップ", keywords: ["結婚", "契約", "対人関係"] },
  8: { theme: "変容・継承", keywords: ["死と再生", "共有財産", "深層心理"] },
  9: { theme: "探求・哲学", keywords: ["海外", "高等教育", "精神性"] },
  10: { theme: "キャリア・社会的地位", keywords: ["天職", "名声", "達成"] },
  11: { theme: "友情・未来", keywords: ["仲間", "理想", "社会活動"] },
  12: { theme: "無意識・スピリチュアル", keywords: ["秘密", "癒し", "潜在意識"] },
};

// ========================================
// 解説スタイル
// ========================================

export const READING_STYLES = {
  praise: {
    ja: "ほめて",
    emoji: "😊",
    description: "肯定的、励まし多め、課題も「伸びしろ」として表現",
    example:
      "「あなたには人を惹きつける魅力があります。その直感力は大きな強み。」",
  },
  neutral: {
    ja: "淡々と",
    emoji: "📝",
    description: "中立的、事実ベース",
    example:
      "「論理的思考と直感のバランスが取れています。対人関係では慎重な傾向。」",
  },
  strict: {
    ja: "厳しく",
    emoji: "💪",
    description: "課題を明確に指摘、成長のためのアドバイス",
    example:
      "「優柔不断になりやすい傾向。決断を先延ばしにせず、行動しましょう。」",
  },
} as const;

// ========================================
// 解説セクションのアイコン
// ========================================

export const SECTION_ICONS = {
  summary: "✧",
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  northNode: "☊",
  chiron: "⚷",
  advice: "✧",
  love: "♡",
  future: "⟡",
} as const;

