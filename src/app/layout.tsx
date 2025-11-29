import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

const GTM_ID = "GTM-53V6NJ6B";

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
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </head>
      <body className="font-base">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
