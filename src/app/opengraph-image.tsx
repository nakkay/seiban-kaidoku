import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "星盤解読 - あなたの運命を読み解く";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Zen Antiqueフォントを読み込む
  const fontPath = join(process.cwd(), "public", "fonts", "ZenAntique-Regular.ttf");
  const fontData = await readFile(fontPath);

  // 背景画像を読み込む
  const bgPath = join(process.cwd(), "public", "bg", "fire.png");
  const bgData = await readFile(bgPath);
  const bgBase64 = `data:image/png;base64,${bgData.toString("base64")}`;

  // 獅子座の画像を読み込む（象徴的な星座として）
  const zodiacPath = join(process.cwd(), "public", "zodiac", "leo.png");
  const zodiacData = await readFile(zodiacPath);
  const zodiacBase64 = `data:image/png;base64,${zodiacData.toString("base64")}`;

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
          overflow: "hidden",
        }}
      >
        {/* 背景画像 */}
        <img
          src={bgBase64}
          alt=""
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* コンテンツ */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 10,
            marginTop: -40,
          }}
        >
          {/* 星座イラスト */}
          <img
            src={zodiacBase64}
            alt=""
            width={420}
            height={420}
            style={{
              marginBottom: 24,
              opacity: 0.9,
            }}
          />

          {/* タイトル */}
          <div
            style={{
              fontSize: 84,
              fontFamily: "ZenAntique",
              color: "#d4af55",
              marginBottom: 20,
              letterSpacing: "0.1em",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.8), 0 4px 24px rgba(0, 0, 0, 0.6)",
            }}
          >
            星盤解読
          </div>

          {/* サブタイトル */}
          <div
            style={{
              fontSize: 36,
              color: "rgba(255, 255, 255, 0.9)",
              letterSpacing: "0.15em",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.7)",
            }}
          >
            西洋占星術 × AI
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "ZenAntique",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}



