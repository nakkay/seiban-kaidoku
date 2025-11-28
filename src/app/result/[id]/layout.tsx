import type { Metadata } from "next";

// element_patternから日本語タイトルを生成
const elementPatternToTitle: Record<string, string> = {
  "fire": "火の刻印",
  "earth": "地の刻印",
  "air": "風の刻印",
  "water": "水の刻印",
  "air-fire": "火と風の刻印",
  "earth-fire": "火と地の刻印",
  "fire-water": "火と水の刻印",
  "air-earth": "地と風の刻印",
  "earth-water": "地と水の刻印",
  "air-water": "風と水の刻印",
  "air-earth-fire": "火・地・風の刻印",
  "earth-fire-water": "火・地・水の刻印",
  "air-fire-water": "火・風・水の刻印",
  "air-earth-water": "地・風・水の刻印",
  "balanced": "調和の刻印",
};

interface LayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  try {
    // APIから結果を取得
    const response = await fetch(`${baseUrl}/api/horoscope/${params.id}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch reading");
    }

    const data = await response.json();
    const hero = data.reading?.hero;
    const elementPattern = data.elementPattern;

    if (hero) {
      const elementTitle = elementPattern ? elementPatternToTitle[elementPattern] || hero.elementTitle : hero.elementTitle;
      const title = `${hero.zodiacSign} × ${elementTitle} - 星盤解読`;
      const description = `${hero.catchphrase}。AIがあなただけのホロスコープを読み解きました。`;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: "website",
          url: `${baseUrl}/result/${params.id}`,
          siteName: "星盤解読",
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  // フォールバック
  return {
    title: "あなたの星盤解読結果",
    description: "AIがあなただけのホロスコープを読み解きました。",
    openGraph: {
      title: "あなたの星盤解読結果",
      description: "AIがあなただけのホロスコープを読み解きました。",
      type: "website",
      siteName: "星盤解読",
    },
    twitter: {
      card: "summary_large_image",
      title: "あなたの星盤解読結果",
      description: "AIがあなただけのホロスコープを読み解きました。",
    },
  };
}

export default function ResultLayout({ children }: LayoutProps) {
  return <>{children}</>;
}

