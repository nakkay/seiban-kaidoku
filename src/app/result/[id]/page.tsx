"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ReadingSection,
  ShareButtons,
  CTACard,
  HeroVisual,
} from "@/components/features/ReadingSection";
import { CompatibilityModal } from "@/components/features/CompatibilityModal";
import { Starfield } from "@/components/ui/Starfield";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import type { Reading } from "@/types";

// ティーザーを表示するセクションID
const teaserSections: Record<number, { text: string; type: "premium" | "compatibility" }> = {
  2: { text: "詳細解説では、太陽と他の惑星の関係（アスペクト）から、さらに深いあなたの本質を読み解きます。", type: "premium" },
  5: { text: "気になるあの人との相性は？2人の星の配置から、恋愛相性を詳しく診断します。", type: "compatibility" },
  7: { text: "詳細解説の【未来編】では、5年ごとの運気の流れや今年の運勢について詳しく解説します。", type: "premium" },
};

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

interface ResultPageProps {
  params: { id: string };
}

export default function ResultPage({ params }: ResultPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reading, setReading] = useState<Reading | null>(null);
  const [elementPattern, setElementPattern] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompatibilityModalOpen, setIsCompatibilityModalOpen] = useState(false);
  const [expandedCompatibilitySections, setExpandedCompatibilitySections] = useState<string[]>([]);
  
  const toggleCompatibilitySection = (title: string) => {
    setExpandedCompatibilitySections(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

  // 決済完了後のリダイレクト処理
  const paidParam = searchParams.get("paid");

  useEffect(() => {
    async function fetchReading() {
      try {
        const response = await fetch(`/api/horoscope/${params.id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "結果の取得に失敗しました");
          return;
        }

        setReading(data.reading);
        setElementPattern(data.elementPattern);
        setIsPaid(data.isPaid || false);

        // 決済完了パラメータがある場合
        if (paidParam === "1") {
          // Webhookがまだ処理されていない場合、手動でis_paidを更新
          if (!data.isPaid) {
            const markPaidResponse = await fetch(`/api/horoscope/${params.id}/mark-paid`, { method: "POST" });
            if (!markPaidResponse.ok) {
              console.error("Failed to mark as paid");
            }
            // DB更新が反映されるまで少し待つ
            await new Promise(resolve => setTimeout(resolve, 500));
          }
          router.replace(`/result/${params.id}/premium`);
          return;
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("ネットワークエラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    }

    fetchReading();
  }, [params.id, paidParam, router]);

  // 購入処理
  const handlePurchase = useCallback(async () => {
    if (isPurchasing) return;

    setIsPurchasing(true);
    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId: params.id }),
      });

      const data = await response.json();

      if (data.alreadyPaid) {
        // すでに支払い済みの場合、プレミアムページへ
        router.push(`/result/${params.id}/premium`);
        return;
      }

      if (!response.ok) {
        setError(data.error || "決済の開始に失敗しました");
        return;
      }

      // Stripe Checkoutへリダイレクト
      window.location.href = data.checkoutUrl;
    } catch (err) {
      console.error("Purchase error:", err);
      setError("決済の開始に失敗しました");
    } finally {
      setIsPurchasing(false);
    }
  }, [params.id, isPurchasing, router]);

  // ローディング状態
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Starfield starCount={60} />
        <BackgroundGlow variant="centered" />
        <div className="text-center relative z-10">
          <div className="text-4xl text-gold mb-4">✦</div>
          <p className="text-text-muted">読み込み中...</p>
        </div>
      </div>
    );
  }

  // エラー状態
  if (error || !reading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Starfield starCount={60} />
        <BackgroundGlow variant="centered" />
        <div className="text-center relative z-10">
          <div className="text-4xl text-red-400 mb-4">⚠</div>
          <p className="text-text-muted mb-6">{error || "結果が見つかりませんでした"}</p>
          <Link
            href="/"
            className="bg-gold text-bg px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors"
          >
            トップページへ戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <Header
        showCta={false}
        rightElement={
          <Link
            href="/"
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            もう一度占う
          </Link>
        }
      />

      <div className="container relative z-10">
        {/* Hero Visual */}
        <HeroVisual
          zodiacSign={reading.hero.zodiacSign}
          elementTitle={elementPattern ? elementPatternToTitle[elementPattern] || reading.hero.elementTitle : reading.hero.elementTitle}
          catchphrase={reading.hero.catchphrase}
          readingId={params.id}
        />

        {/* Share Buttons */}
        <div className="my-5">
          <ShareButtons 
            zodiacSign={reading.hero.zodiacSign}
            elementTitle={elementPattern ? elementPatternToTitle[elementPattern] || reading.hero.elementTitle : reading.hero.elementTitle}
            catchphrase={reading.hero.catchphrase}
          />
        </div>

        {/* Reading Sections */}
        <div className="mt-8">
          {reading.sections.map((section) => {
            const teaser = teaserSections[section.id];
            return (
              <ReadingSection
                key={section.id}
                section={section}
                showTeaser={!!teaser}
                teaserText={teaser?.text}
                teaserType={teaser?.type}
                onCompatibilityClick={() => setIsCompatibilityModalOpen(true)}
              />
            );
          })}
        </div>

        {/* Final CTA */}
        {!isPaid && (
          <CTACard 
            variant="final" 
            onPurchase={handlePurchase}
            isLoading={isPurchasing}
          />
        )}
        
        {/* 支払い済みの場合、プレミアムページへの誘導 */}
        {isPaid && (
          <div className="bg-card border border-card-border rounded-xl p-8 text-center my-10">
            <h3 className="font-serif text-lg text-gold-light mb-3">
              詳細解説をご購入いただきありがとうございます
            </h3>
            <Link
              href={`/result/${params.id}/premium`}
              className="inline-block bg-gold-gradient text-bg font-semibold text-base py-3.5 px-12 rounded-full shadow-gold hover:shadow-gold-hover hover:-translate-y-0.5 transition-all"
            >
              詳細解説を見る
            </Link>
          </div>
        )}

        {/* 相性診断CTA */}
        <div className="bg-card border border-[rgba(232,121,160,0.3)] rounded-xl p-6 md:p-8 my-8">
          <div className="text-center mb-4 md:mb-6">
            <span className="inline-block bg-[rgba(232,121,160,0.2)] text-pink text-xs font-semibold py-1 px-3 rounded-full mb-3 md:mb-4">
              💕 相性診断
            </span>
            <h3 className="font-serif text-lg md:text-xl text-text mb-2">
              気になる相手との相性は？
            </h3>
            <p className="text-sm text-text-muted">
              2人の星の配置から、恋愛相性を詳しく診断します
            </p>
          </div>

          {/* 診断項目プレビュー */}
          <div className="mb-4 md:mb-6">
            {/* スマホ: 項目ごとのアコーディオン */}
            <div className="md:hidden space-y-2">
              {[
                { title: "関係性", items: ["2人の相性スコア", "関係性サマリ", "コミュニケーション相性"] },
                { title: "恋愛", items: ["恋愛・愛情の相性", "価値観の相性", "長期的な相性"] },
                { title: "注意点", items: ["衝突ポイント", "成長ポイント"] },
                { title: "アドバイス", items: ["2人へのメッセージ"] },
              ].map((section) => (
                <div key={section.title} className="border border-divider rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleCompatibilitySection(section.title)}
                    className="w-full flex items-center justify-between p-3 bg-bg/50"
                  >
                    <h4 className="font-serif text-sm text-pink flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-pink rounded-full" />
                      {section.title}
                    </h4>
                    <span className={`text-pink text-xs transition-transform ${expandedCompatibilitySections.includes(section.title) ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {expandedCompatibilitySections.includes(section.title) && (
                    <ul className="p-3 pt-0 space-y-1">
                      {section.items.map((item) => (
                        <li key={item} className="text-sm text-text-muted flex items-center gap-2">
                          <span className="text-pink/60">♡</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            
            {/* PC: グリッド表示 */}
            <div className="hidden md:grid grid-cols-2 gap-4">
              {[
                { title: "関係性", items: ["2人の相性スコア", "関係性サマリ", "コミュニケーション相性"] },
                { title: "恋愛", items: ["恋愛・愛情の相性", "価値観の相性", "長期的な相性"] },
                { title: "注意点", items: ["衝突ポイント", "成長ポイント"] },
                { title: "アドバイス", items: ["2人へのメッセージ"] },
              ].map((section) => (
                <div
                  key={section.title}
                  className="bg-bg/50 border border-divider rounded-lg p-4"
                >
                  <h4 className="font-serif text-sm text-pink mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-pink rounded-full" />
                    {section.title}
                  </h4>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-text-muted flex items-center gap-2"
                      >
                        <span className="text-pink/60">♡</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* CTAボタン */}
          <div className="text-center">
            <button
              onClick={() => setIsCompatibilityModalOpen(true)}
              className="inline-block text-bg font-semibold text-base py-4 px-16 rounded-full shadow-[0_4px_24px_rgba(232,121,160,0.3)] hover:shadow-[0_6px_32px_rgba(232,121,160,0.4)] hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(to right, #e879a0, #f4a5c0)" }}
            >
              相手の情報を入力する
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div className="my-8">
          <ShareButtons 
            zodiacSign={reading.hero.zodiacSign}
            elementTitle={elementPattern ? elementPatternToTitle[elementPattern] || reading.hero.elementTitle : reading.hero.elementTitle}
            catchphrase={reading.hero.catchphrase}
          />
        </div>
      </div>

      <Footer />

      {/* 相性診断モーダル */}
      <CompatibilityModal
        isOpen={isCompatibilityModalOpen}
        onClose={() => setIsCompatibilityModalOpen(false)}
        person1ReadingId={params.id}
      />
    </main>
  );
}

