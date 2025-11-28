import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0e1a",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: {
    default: "星盤解読（ホロスコープ）- あなたの運命を読み解く",
    template: "%s | 星盤解読",
  },
  description:
    "生まれた瞬間の星空が、あなたの運命を映します。西洋占星術を「日本語で」「仕組みから」「AI解説付きで」体験できるサービスです。",
  keywords: [
    "ホロスコープ",
    "西洋占星術",
    "星占い",
    "誕生日占い",
    "AI占い",
    "無料占い",
    "星盤",
    "出生図",
  ],
  authors: [{ name: "星盤解読" }],
  creator: "星盤解読",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "星盤解読",
    title: "星盤解読（ホロスコープ）- あなたの運命を読み解く",
    description:
      "生まれた瞬間の星空が、あなたの運命を映します。西洋占星術を「日本語で」「仕組みから」「AI解説付きで」体験。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "星盤解読 - あなたの運命を読み解く",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "星盤解読（ホロスコープ）- あなたの運命を読み解く",
    description:
      "生まれた瞬間の星空が、あなたの運命を映します。西洋占星術をAI解説付きで体験。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-base">
        {children}
      </body>
    </html>
  );
}
