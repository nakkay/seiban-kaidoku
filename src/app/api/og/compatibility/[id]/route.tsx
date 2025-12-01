import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { getCompatibilityById } from "@/lib/supabase/compatibilities";
import { getReadingById } from "@/lib/supabase";

export const runtime = "edge";

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
  // 英語からもマッピング
  "aries": "aries",
  "taurus": "taurus",
  "gemini": "gemini",
  "cancer": "cancer",
  "leo": "leo",
  "virgo": "virgo",
  "libra": "libra",
  "scorpio": "scorpio",
  "sagittarius": "sagittarius",
  "capricorn": "capricorn",
  "aquarius": "aquarius",
  "pisces": "pisces",
};

// 英語→日本語星座名変換
const zodiacToJapanese: Record<string, string> = {
  "aries": "牡羊座",
  "taurus": "牡牛座",
  "gemini": "双子座",
  "cancer": "蟹座",
  "leo": "獅子座",
  "virgo": "乙女座",
  "libra": "天秤座",
  "scorpio": "蠍座",
  "sagittarius": "射手座",
  "capricorn": "山羊座",
  "aquarius": "水瓶座",
  "pisces": "魚座",
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // ベースURLを取得
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  // Zen Antiqueフォントを読み込む
  let fontData: ArrayBuffer | null = null;
  try {
    const fontResponse = await fetch(`${baseUrl}/fonts/ZenAntique-Regular.ttf`);
    if (fontResponse.ok) {
      fontData = await fontResponse.arrayBuffer();
    }
  } catch {
    // フォント読み込み失敗時は無視
  }

  try {
    const { id } = params;

    // データベースから相性診断結果を取得
    const compatibility = await getCompatibilityById(id);

    if (!compatibility) {
      // デフォルトOGP
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
              background: "linear-gradient(180deg, rgba(15, 22, 40, 0.9) 0%, rgba(60, 30, 50, 0.9) 100%)",
              fontFamily: fontData ? "Zen Antique" : "sans-serif",
            }}
          >
            <div style={{ display: "flex", fontSize: 80, color: "#e879a0", marginBottom: 20 }}>💕</div>
            <div style={{ display: "flex", fontSize: 48, color: "#f8f6f1", fontWeight: "bold" }}>
              相性診断
            </div>
            <div style={{ display: "flex", fontSize: 24, color: "rgba(248, 246, 241, 0.7)", marginTop: 16 }}>
              2人の星を読み解く
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          ...(fontData ? {
            fonts: [
              {
                name: "Zen Antique",
                data: fontData,
                style: "normal" as const,
              },
            ],
          } : {}),
        }
      );
    }

    // Person 1の情報を取得
    const person1Reading = await getReadingById(compatibility.person1_reading_id);
    const person1Zodiac = person1Reading?.basic_reading?.hero?.zodiacSign || "魚座";
    
    // Person 2の情報
    const person2ZodiacEn = compatibility.person2_zodiac || "taurus";
    const person2Zodiac = zodiacToJapanese[person2ZodiacEn] || "牡牛座";

    // 相性スコアとキャッチコピー
    const score = compatibility.score || 87;
    const catchphrase = compatibility.catchphrase || "運命の糸で結ばれた2人";

    // ファイル名を取得
    const person1ZodiacFile = zodiacFileMap[person1Zodiac] || "pisces";
    const person2ZodiacFile = zodiacFileMap[person2ZodiacEn] || "taurus";

    // 画像URL
    const person1ZodiacUrl = `${baseUrl}/zodiac/${person1ZodiacFile}.png`;
    const person2ZodiacUrl = `${baseUrl}/zodiac/${person2ZodiacFile}.png`;

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
            background: "linear-gradient(180deg, rgba(15, 22, 40, 0.95) 0%, rgba(60, 30, 50, 0.95) 100%)",
            fontFamily: fontData ? "Zen Antique" : "sans-serif",
          }}
        >
          {/* 背景のグラデーションオーバーレイ */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              background: "radial-gradient(ellipse at 50% 80%, rgba(232, 121, 160, 0.2) 0%, transparent 60%)",
            }}
          />

          {/* メインコンテンツ */}
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
            {/* 2人の星座 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 60,
                marginBottom: 30,
              }}
            >
              {/* Person 1 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={person1ZodiacUrl}
                  alt={person1Zodiac}
                  width={200}
                  height={200}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 16,
                    border: "2px solid rgba(212, 175, 85, 0.3)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                    background: "rgba(10, 14, 26, 0.5)",
                    filter: "drop-shadow(0 0 30px rgba(212, 175, 85, 0.5))",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    fontSize: 24,
                    color: "#d4af55",
                    marginTop: 12,
                  }}
                >
                  {person1Zodiac}
                </div>
              </div>

              {/* ハートコネクター */}
              <div
                style={{
                  display: "flex",
                  fontSize: 60,
                  color: "#e879a0",
                  filter: "drop-shadow(0 0 20px rgba(232, 121, 160, 0.6))",
                }}
              >
                💕
              </div>

              {/* Person 2 */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={person2ZodiacUrl}
                  alt={person2Zodiac}
                  width={200}
                  height={200}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 16,
                    border: "2px solid rgba(212, 175, 85, 0.3)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
                    background: "rgba(10, 14, 26, 0.5)",
                    filter: "drop-shadow(0 0 30px rgba(212, 175, 85, 0.5))",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    fontSize: 24,
                    color: "#d4af55",
                    marginTop: 12,
                  }}
                >
                  {person2Zodiac}
                </div>
              </div>
            </div>

            {/* 相性スコア */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 18,
                  color: "rgba(248, 246, 241, 0.6)",
                  letterSpacing: "0.2em",
                  marginBottom: 8,
                }}
              >
                COMPATIBILITY SCORE
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 80,
                  color: "#e879a0",
                  fontWeight: "bold",
                  textShadow: "0 0 40px rgba(232, 121, 160, 0.5)",
                }}
              >
                {score}%
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 32,
                  color: "#f8f6f1",
                  marginTop: 8,
                  letterSpacing: "0.05em",
                }}
              >
                {catchphrase}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        ...(fontData ? {
          fonts: [
            {
              name: "Zen Antique",
              data: fontData,
              style: "normal" as const,
            },
          ],
        } : {}),
        headers: {
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      }
    );
  } catch (error) {
    console.error("Compatibility OGP generation error:", error);

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
            background: "linear-gradient(180deg, #0f1424 0%, #2a1a2a 100%)",
          }}
        >
          <div style={{ display: "flex", fontSize: 80, color: "#e879a0", marginBottom: 20 }}>💕</div>
          <div style={{ display: "flex", fontSize: 48, color: "#f8f6f1" }}>
            相性診断
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }
}





