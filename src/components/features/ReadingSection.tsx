"use client";

import { useState } from "react";
import type { ReadingSection as ReadingSectionType } from "@/types";

interface ReadingSectionProps {
  section: ReadingSectionType;
  showTeaser?: boolean;
  teaserText?: string;
  teaserType?: "premium" | "compatibility";
  onCompatibilityClick?: () => void;
}

export function ReadingSection({
  section,
  showTeaser = false,
  teaserText,
  teaserType = "premium",
  onCompatibilityClick,
}: ReadingSectionProps) {
  return (
    <div className="py-8 border-b border-divider last:border-b-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gold-subtle border border-gold/30 flex items-center justify-center text-lg text-gold">
          {section.icon}
        </div>
        <div className="flex-1">
          <p className="text-xs text-accent tracking-[0.15em] uppercase">
            {String(section.id).padStart(2, "0")}
          </p>
          <h2 className="font-serif text-base">{section.title}</h2>
        </div>
      </div>

      {/* Content */}
      <div className="pl-[52px] md:pl-[52px] pl-0 mt-4 md:mt-0">
        {/* Catch（一言キャッチフレーズ） */}
        <h3 className="font-serif text-lg text-gold-light leading-snug mb-3">
          {section.catch}
        </h3>

        {/* Tendency Badge（惑星配置） */}
        {section.tendency && (
          <span className="inline-block bg-accent-subtle border border-accent/25 text-accent text-sm py-1 px-3 rounded-full mb-4">
            {section.tendency}
          </span>
        )}

        {/* Key Points */}
        {section.keyPoints && section.keyPoints.length > 0 && (
          <div className="my-4 p-4 bg-white/[0.02] rounded-xl border-l-2 border-gold">
            <p className="text-sm text-gold tracking-[0.1em] uppercase mb-2.5">
              {section.keyPointsTitle || "ポイント"}
            </p>
            <ul className="space-y-2">
              {section.keyPoints.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-text leading-relaxed"
                >
                  <span className="text-gold text-xs mt-1 shrink-0">✦</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-text-muted leading-loose">
          {section.description}
        </p>

        {/* Teaser */}
        {showTeaser && teaserText && (
          <div className={`mt-5 p-4 rounded-xl flex gap-3 ${
            teaserType === "compatibility" 
              ? "bg-[rgba(232,121,160,0.08)] border border-[rgba(232,121,160,0.2)]" 
              : "bg-gold/[0.06] border border-gold/15"
          }`}>
            <span className="text-base shrink-0">
              {teaserType === "compatibility" ? "💕" : "💡"}
            </span>
            <div className="flex-1">
              <p className="text-sm text-text-muted leading-relaxed mb-2">
                {teaserText}
              </p>
              {teaserType === "compatibility" ? (
                <button
                  onClick={onCompatibilityClick}
                  className="text-sm text-pink hover:text-[#f4a5c0] transition-colors inline-flex items-center gap-1"
                >
                  相性診断をする →
                </button>
              ) : (
                <a
                  href="#cta"
                  className="text-sm text-gold hover:text-gold-light transition-colors inline-flex items-center gap-1"
                >
                  詳しく見る →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Share Buttons Component
interface ShareButtonsProps {
  zodiacSign?: string;
  elementTitle?: string;
  catchphrase?: string;
}

export function ShareButtons({ zodiacSign, elementTitle, catchphrase }: ShareButtonsProps = {}) {
  const [copied, setCopied] = useState(false);

  // シェア文言を生成
  const generateShareText = () => {
    if (zodiacSign && elementTitle && catchphrase) {
      return `【${zodiacSign} × ${elementTitle}】${catchphrase}

AIが読み解く、私だけのホロスコープ。あなたも試してみて✨

#星盤解読 #西洋占星術 #ホロスコープ`;
    }
    return "AIが読み解く、私だけのホロスコープ。あなたも試してみて✨ #星盤解読 #西洋占星術 #ホロスコープ";
  };

  const handleShare = (platform: "x" | "line") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = generateShareText();

    const shareUrls = {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    };

    window.open(shareUrls[platform], "_blank", "width=600,height=400");
  };

  const handleCopyUrl = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <div className="flex justify-center gap-2.5 md:gap-3 flex-wrap">
      <button
        onClick={() => handleShare("x")}
        className="inline-flex items-center gap-1.5 py-2.5 px-5 md:py-3 md:px-6 border border-accent rounded-full text-accent text-sm font-medium bg-transparent hover:bg-accent-subtle transition-all"
      >
        𝕏 でシェア
      </button>
      <button
        onClick={() => handleShare("line")}
        className="inline-flex items-center gap-1.5 py-2.5 px-5 md:py-3 md:px-6 border border-accent rounded-full text-accent text-sm font-medium bg-transparent hover:bg-accent-subtle transition-all"
      >
        LINEでシェア
      </button>
      <button
        onClick={handleCopyUrl}
        className="inline-flex items-center gap-1.5 py-2.5 px-5 md:py-3 md:px-6 border border-accent rounded-full text-accent text-sm font-medium bg-transparent hover:bg-accent-subtle transition-all"
      >
        {copied ? "✓ コピー完了" : "🔗 URLコピー"}
      </button>
    </div>
  );
}

// CTA Card Component
interface CTACardProps {
  variant?: "main" | "final";
  onPurchase?: () => void;
  isLoading?: boolean;
}

export function CTACard({ variant = "main", onPurchase, isLoading = false }: CTACardProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  const toggleSection = (part: string) => {
    setExpandedSections(prev => 
      prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
    );
  };
  
  const buttonContent = isLoading ? (
    <span className="flex items-center gap-2">
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      処理中...
    </span>
  ) : (
    variant === "main" ? "詳細解説を購入する" : (
      <>詳細解説を購入する<span style={{ fontSize: "12px" }}>（500円）</span></>
    )
  );

  if (variant === "main") {
    return (
      <div className="bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/30 rounded-xl p-7 text-center my-6">
        <h3 className="font-serif text-lg text-gold-light mb-2">
          詳細解説を見る<span className="font-base" style={{ fontSize: "13px" }}>（500円）</span>
        </h3>
        <p className="text-sm text-text-muted mb-4">
          恋愛編・未来編を含む全18項目
        </p>
        <button
          onClick={onPurchase}
          disabled={isLoading}
          className="inline-block bg-gold-gradient text-bg font-semibold text-base py-3.5 px-12 rounded-full shadow-gold hover:shadow-gold-hover hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {buttonContent}
        </button>
      </div>
    );
  }

  // 詳細解説の全項目
  const detailedItems = [
    { part: "基本編", items: ["太陽星座", "月星座", "アセンダント", "水星", "金星", "火星", "木星", "土星", "天王星", "海王星"] },
    { part: "恋愛編", items: ["恋愛傾向", "理想のパートナー", "相性の良いタイプ", "恋愛での課題", "愛の表現方法"] },
    { part: "未来編", items: ["今年の運勢", "転機の時期", "才能の開花"] },
  ];

  return (
    <div
      id="cta"
      className="bg-card border border-card-border rounded-xl p-8 my-10"
    >
      <div className="text-center mb-6 md:mb-8">
        <span className="inline-block bg-gold/20 text-gold text-xs font-semibold py-1 px-3 rounded-full mb-3 md:mb-4">
          PREMIUM
        </span>
        <h3 className="font-serif text-lg md:text-xl mb-2">
          詳細解説で、さらに深く自分を知る
        </h3>
        <p className="text-xs md:text-sm text-text-muted">
          より高精度なAIによる深い洞察を含む全18項目の解説
        </p>
      </div>

      {/* 項目プレビュー */}
      <div className="mb-6 md:mb-8">
        {/* スマホ: 項目ごとのアコーディオン */}
        <div className="md:hidden space-y-2">
          {detailedItems.map((section) => (
            <div key={section.part} className="border border-divider rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(section.part)}
                className="w-full flex items-center justify-between p-3 bg-bg/50"
              >
                <h4 className="font-serif text-sm text-gold-light flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                  {section.part}
                </h4>
                <span className={`text-gold text-xs transition-transform ${expandedSections.includes(section.part) ? "rotate-180" : ""}`}>▼</span>
              </button>
              {expandedSections.includes(section.part) && (
                <ul className="p-3 pt-0 space-y-1.5">
                  {section.items.map((item) => (
                    <li key={item} className="text-xs text-text-muted flex items-center gap-2">
                      <span className="text-gold/60">✦</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
        
        {/* PC: グリッド表示 */}
        <div className="hidden md:grid grid-cols-3 gap-4">
          {detailedItems.map((section) => (
            <div
              key={section.part}
              className="bg-bg/50 border border-divider rounded-lg p-4"
            >
              <h4 className="font-serif text-sm text-gold-light mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-gold rounded-full" />
                {section.part}
              </h4>
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className="text-xs text-text-muted flex items-center gap-2"
                  >
                    <span className="text-gold/60">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 購入ボタン */}
      <div className="text-center">
        <button
          onClick={onPurchase}
          disabled={isLoading}
          className="inline-block bg-gold-gradient text-bg font-semibold text-base py-4 px-8 md:px-16 rounded-full shadow-gold hover:shadow-gold-hover hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 whitespace-nowrap"
        >
          {buttonContent}
        </button>
        <p className="text-xs text-text-muted/60 mt-4">
          税込 • Stripeによる安全な決済 • クレジットカード対応
        </p>
      </div>
    </div>
  );
}

// Hero Visual Component
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
  // AIが別表記で返す場合の対応
  "みずがめ座": "aquarius",
  "うお座": "pisces",
  "いて座": "sagittarius",
  "おとめ座": "virgo",
  "おひつじ座": "aries",
  "おうし座": "taurus",
  "ふたご座": "gemini",
  "かに座": "cancer",
  "しし座": "leo",
  "てんびん座": "libra",
  "さそり座": "scorpio",
  "やぎ座": "capricorn",
};

// エレメントタイトル→背景ファイル名マップ
const elementBgMap: Record<string, string> = {
  "火の刻印": "fire",
  "地の刻印": "earth",
  "風の刻印": "air",
  "水の刻印": "water",
  "火と風の刻印": "fire-air",
  "火と地の刻印": "fire-earth",
  "火と水の刻印": "fire-water",
  "地と風の刻印": "earth-air",
  "地と水の刻印": "earth-water",
  "風と水の刻印": "air-water",
  "火・地・風の刻印": "fire-earth-air",
  "火・地・水の刻印": "fire-earth-water",
  "火・風・水の刻印": "fire-air-water",
  "地・風・水の刻印": "earth-air-water",
  "調和の刻印": "balanced",
  // AIが別表現で返す場合の対応
  "星の調和": "balanced",
  "炎の刻印": "fire",
};

interface HeroVisualProps {
  zodiacSign: string;
  elementTitle: string;
  catchphrase: string;
  readingId?: string;
  isPremium?: boolean; // 互換性のため残すが、表示方法は同じ
}

export function HeroVisual({
  zodiacSign,
  elementTitle,
  catchphrase,
  readingId,
}: HeroVisualProps) {
  // OGP画像URL（テキストなしの背景+星座のみ）
  const ogImageUrl = readingId ? `/api/og/${readingId}` : null;

  // フォールバック用（readingIdがない場合）
  const zodiacFile = zodiacFileMap[zodiacSign] || "pisces";
  const bgFile = elementBgMap[elementTitle] || "water";
  const bgUrl = `/bg/${bgFile}.png`;
  const zodiacUrl = `/zodiac/${zodiacFile}.png`;

  return (
    <div className="text-center my-6">
      {/* OGP画像の上にテキストをオーバーレイ */}
      {ogImageUrl ? (
        <div className="mx-auto mb-6 w-full md:max-w-[720px] relative rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5),0_4px_20px_rgba(212,175,85,0.2)]"
          style={{ aspectRatio: "1200 / 630" }}
        >
          {/* OGP画像（背景+星座のみ） */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ogImageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* テキストオーバーレイ */}
          <div className="absolute left-0 right-0 bottom-[20px] md:bottom-[40px] flex flex-col items-center">
            {/* サブコピー */}
            <p className="font-serif text-lg md:text-xl text-gold tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {zodiacSign} × {elementTitle}
            </p>
            {/* メインコピー */}
            <h1 className="font-serif text-xl md:text-3xl text-white tracking-wide drop-shadow-[0_3px_15px_rgba(0,0,0,0.6)]">
              {catchphrase}
            </h1>
          </div>
        </div>
      ) : (
        /* フォールバック（readingIdがない場合、直接画像を使用） */
        <div className="mx-auto mb-6 w-full md:max-w-[720px] relative rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5),0_4px_20px_rgba(212,175,85,0.2)]"
          style={{ aspectRatio: "1200 / 630" }}
        >
          {/* 背景画像 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* オーバーレイ */}
          <div className="absolute inset-0 bg-[rgba(10,14,26,0.4)]" />
          {/* コンテンツ */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* 星座イラスト */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zodiacUrl}
              alt={zodiacSign}
              className="w-[55%] max-w-[280px] h-auto mb-2 drop-shadow-[0_0_50px_rgba(212,175,85,0.7)]"
            />
            {/* サブコピー */}
            <p className="font-serif text-lg md:text-xl text-gold tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {zodiacSign} × {elementTitle}
            </p>
            {/* メインコピー */}
            <h1 className="font-serif text-xl md:text-3xl text-white tracking-wide drop-shadow-[0_3px_15px_rgba(0,0,0,0.6)]">
              {catchphrase}
            </h1>
          </div>
        </div>
      )}
    </div>
  );
}

