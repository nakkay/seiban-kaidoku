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
          }}
        >
          {/* 星座イラスト */}
          <img
            src={zodiacBase64}
            alt=""
            width={280}
            height={280}
            style={{
              marginBottom: 24,
              opacity: 0.9,
            }}
          />

          {/* タイトル */}
          <div
            style={{
              fontSize: 56,
              fontWeight: "bold",
              color: "#d4af55",
              marginBottom: 16,
              letterSpacing: "0.1em",
            }}
          >
            星盤解読
          </div>

          {/* サブタイトル */}
          <div
            style={{
              fontSize: 24,
              color: "rgba(255, 255, 255, 0.85)",
              letterSpacing: "0.15em",
            }}
          >
            西洋占星術 × AI
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}



