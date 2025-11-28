import type { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
  params: { id: string };
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  try {
    // APIから結果を取得
    const response = await fetch(`${baseUrl}/api/compatibility/${params.id}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch compatibility");
    }

    const data = await response.json();

    // AI生成が完了している場合のみ動的タイトルを使用
    if (data && data.reading && data.score > 0) {
      const title = `相性診断 ${data.score}% - 星盤解読`;
      const description = `${data.catchphrase}。AIが2人の星の相性を詳しく読み解きました。`;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: "website",
          url: `${baseUrl}/compatibility/${params.id}`,
          siteName: "星盤解読",
          images: [
            {
              url: `${baseUrl}/api/og/compatibility/${params.id}`,
              width: 1200,
              height: 630,
              alt: "相性診断結果",
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
          images: [`${baseUrl}/api/og/compatibility/${params.id}`],
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  // フォールバック（AI生成中または未完了）
  return {
    title: "相性診断中... - 星盤解読",
    description: "AIが2人の星の相性を読み解いています。",
    openGraph: {
      title: "相性診断 - 星盤解読",
      description: "AIが2人の星の相性を読み解きます。",
      type: "website",
      siteName: "星盤解読",
    },
    twitter: {
      card: "summary_large_image",
      title: "相性診断 - 星盤解読",
      description: "AIが2人の星の相性を読み解きます。",
    },
  };
}

export default function CompatibilityLayout({ children }: LayoutProps) {
  return <>{children}</>;
}

