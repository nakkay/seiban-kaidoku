import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const alt = "星盤解読 - あなたの運命を読み解く";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// 星座名→ファイル名変換マップ
const zodiacFileMap: Record<string, string> = {
  "牡羊座": "aries",
  "牡牛座": "taurus",
  "双子座": "gemini",
  "蟹座": "cancer",
  "獅子座": "leo",
  "乙女座": "virgo",
  "天秤座": "libra",
  "蠍座": "scorpio",
  "射手座": "sagittarius",
  "山羊座": "capricorn",
  "水瓶座": "aquarius",
  "魚座": "pisces",
};

// エレメント→背景ファイル名マップ
const elementBgMap: Record<string, string> = {
  "火": "fire",
  "地": "earth",
  "風": "air",
  "水": "water",
};

export default async function Image({ params }: { params: { id: string } }) {
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
    const hero = data.reading?.hero || {
      zodiacSign: "魚座",
      element: "水",
    };

    // ファイル名を取得
    const zodiacFile = zodiacFileMap[hero.zodiacSign] || "pisces";
    const elementPattern = data.elementPattern || elementBgMap[hero.element] || "water";

    // 背景ファイル名のマッピング（element_patternはアルファベット順、ファイル名は火→地→風→水の順）
    const bgFileMap: Record<string, string> = {
      // 単一
      "fire": "fire",
      "earth": "earth",
      "air": "air",
      "water": "water",
      // 2要素
      "air-fire": "fire-air",
      "earth-fire": "fire-earth",
      "fire-water": "fire-water",
      "air-earth": "earth-air",
      "earth-water": "earth-water",
      "air-water": "air-water",
      // 3要素
      "air-earth-fire": "fire-earth-air",
      "earth-fire-water": "fire-earth-water",
      "air-fire-water": "fire-air-water",
      "air-earth-water": "earth-air-water",
      // バランス
      "balanced": "balanced",
    };

    const bgFileName = bgFileMap[elementPattern] || elementPattern;

    // 画像URL
    const bgUrl = `${baseUrl}/bg/${bgFileName}.png`;
    const zodiacUrl = `${baseUrl}/zodiac/${zodiacFile}.png`;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {/* 背景画像 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgUrl}
            alt=""
            width={1200}
            height={630}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 1200,
              height: 630,
              objectFit: "cover",
            }}
          />

          {/* オーバーレイ */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(10, 14, 26, 0.4)",
              display: "flex",
            }}
          />

          {/* メインコンテンツ: 星座イラストのみ（テキストなし） */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              zIndex: 10,
            }}
          >
            {/* 星座イラスト */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zodiacUrl}
              alt={hero.zodiacSign}
              width={480}
              height={480}
              style={{
                width: 480,
                height: 480,
                filter: "drop-shadow(0 0 50px rgba(212, 175, 85, 0.7))",
              }}
            />
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  } catch {
    // エラー時のフォールバック
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0a0e1a 0%, #1a1f35 50%, #0f1424 100%)",
          }}
        >
          <div style={{ display: "flex", fontSize: 80, color: "#d4af55", marginBottom: 20 }}>✦</div>
          <div style={{ display: "flex", fontSize: 48, color: "#f8f6f1" }}>
            星盤解読
          </div>
          <div style={{ display: "flex", fontSize: 24, color: "rgba(248, 246, 241, 0.7)", marginTop: 16 }}>
            あなたの運命を読み解く
          </div>
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
