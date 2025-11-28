"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ReadingSection,
  ShareButtons,
  HeroVisual,
} from "@/components/features/ReadingSection";
import { Starfield } from "@/components/ui/Starfield";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { CompatibilityModal } from "@/components/features/CompatibilityModal";
import type { Reading } from "@/types";

// プレミアム解説生成中のメッセージ
const PREMIUM_MESSAGES = [
  "アスペクトの影響を深掘り中",
  "今年の運勢を計算中",
  "転機の時期を特定しています",
  "才能の開花時期を探っています",
  "天体の配置から人生の流れを読み解いています",
  "ハウスの影響を分析中",
  "あなたの可能性を探っています",
  "あなただけの詳細解説を仕上げています",
];

// トリビア
const TRIVIA = [
  "木星は「幸運の星」と呼ばれ、約12年で黄道12宮を一周します",
  "金星は愛と美の女神ヴィーナスにちなんで名付けられました",
  "土星は「試練の星」とも呼ばれ、人生の課題を示します",
  "月は約29.5日で全ての星座を巡ります",
  "アセンダントは「あなたの仮面」とも呼ばれます",
];

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

// パート分けの定義
const parts = [
  { startId: 1, endId: 10, label: "Part 1", title: "基本解説", count: "10項目" },
  { startId: 11, endId: 15, label: "Part 2", title: "恋愛編", count: "5項目" },
  { startId: 16, endId: 18, label: "Part 3", title: "未来編", count: "3項目" },
];

interface PremiumPageProps {
  params: { id: string };
}

export default function PremiumPage({ params }: PremiumPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [basicReading, setBasicReading] = useState<Reading | null>(null);
  const [detailedReading, setDetailedReading] = useState<Reading | null>(null);
  const [elementPattern, setElementPattern] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 相性診断モーダル
  const [isCompatibilityModalOpen, setIsCompatibilityModalOpen] = useState(false);
  const [expandedCompatibilitySections, setExpandedCompatibilitySections] = useState<string[]>([]);
  
  const toggleCompatibilitySection = (title: string) => {
    setExpandedCompatibilitySections(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };
  
  // ローディング用のstate
  const [messageIndex, setMessageIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  // 決済完了パラメータ
  const paidParam = searchParams.get("paid");

  // 基本データと詳細解説を取得
  useEffect(() => {
    async function fetchData() {
      try {
        // 決済完了パラメータがある場合、まずmark-paidを呼ぶ
        if (paidParam === "1") {
          await fetch(`/api/horoscope/${params.id}/mark-paid`, { 
            method: "POST" 
          });
          
          // URLからパラメータを削除（履歴を汚さないようにreplace）
          router.replace(`/result/${params.id}/premium`, { scroll: false });
          
          // DB更新が反映されるまで少し待つ
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        // 基本データを取得（リトライ付き）
        let data;
        let retryCount = 0;
        const maxRetries = 10;
        
        while (retryCount < maxRetries) {
          // タイムスタンプを追加してキャッシュを完全に回避
          const timestamp = Date.now();
          const response = await fetch(`/api/horoscope/${params.id}?t=${timestamp}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              "Pragma": "no-cache",
            },
          });
          data = await response.json();

          if (!response.ok) {
            setError(data.error || "結果の取得に失敗しました");
            return;
          }

          // 支払い済みの場合は続行
          if (data.isPaid) {
            break;
          }

          // まだis_paidがfalseの場合、少し待ってリトライ
          retryCount++;
          if (retryCount < maxRetries) {
            // 最初の数回は短く、後半は長く待つ
            const waitTime = retryCount <= 3 ? 500 : 1000;
            await new Promise(resolve => setTimeout(resolve, waitTime));
          }
        }

        // 最終的に支払い済みでない場合は基本結果ページへリダイレクト
        if (!data.isPaid) {
          router.replace(`/result/${params.id}`);
          return;
        }

        setElementPattern(data.elementPattern);

        // 詳細解説がすでにある場合は、両方同時にセットしてからローディング終了
        if (data.detailedReading) {
          setBasicReading(data.reading);
          setDetailedReading(data.detailedReading);
          setIsLoading(false);
          return;
        }

        // 詳細解説がない場合は基本解説をセット（この後生成処理へ）
        setBasicReading(data.reading);

        // 詳細解説を生成
        setIsGenerating(true);
        const detailedResponse = await fetch("/api/horoscope/detailed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: params.id }),
        });

        const detailedData = await detailedResponse.json();

        if (!detailedResponse.ok) {
          setError(detailedData.error || "詳細解説の取得に失敗しました");
          return;
        }

        // 詳細解説のデータが正しく含まれているか確認
        if (!detailedData.reading || !detailedData.reading.sections) {
          console.error("Invalid detailed reading data:", detailedData);
          setError("詳細解説の生成に失敗しました。もう一度お試しください。");
          return;
        }

        setDetailedReading(detailedData.reading);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("ネットワークエラーが発生しました");
      } finally {
        setIsLoading(false);
        setIsGenerating(false);
      }
    }

    fetchData();
  }, [params.id, router, paidParam]);

  // ローディング中のメッセージローテーションと経過時間
  useEffect(() => {
    if (!isGenerating) {
      startTimeRef.current = null;
      return;
    }

    // 開始時刻を記録
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
      setTriviaIndex(Math.floor(Math.random() * TRIVIA.length));
    }

    // 経過時間の更新（1秒ごと）
    const timeInterval = setInterval(() => {
      if (startTimeRef.current) {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);

    // メッセージの切り替え（5秒ごと）
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % PREMIUM_MESSAGES.length);
    }, 5000);

    // トリビアの切り替え（8秒ごと）
    const triviaInterval = setInterval(() => {
      setTriviaIndex((prev) => (prev + 1) % TRIVIA.length);
    }, 8000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(messageInterval);
      clearInterval(triviaInterval);
    };
  }, [isGenerating]);

  // ローディング状態
  if (isLoading || isGenerating) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-4">
        <Starfield starCount={60} />
        <BackgroundGlow variant="centered" />
        
        <div className="relative z-10 text-center w-full max-w-sm">
          {/* メインアニメーション */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            {/* 外側のリング */}
            <div className="absolute inset-0 border-4 border-gold/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-gold rounded-full animate-spin" style={{ animationDuration: "2s" }} />
            
            {/* 中央のシンボル */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl text-gold animate-pulse">✧</span>
            </div>
          </div>

          {/* メインメッセージ */}
          <div
            className="font-serif text-md text-text tracking-[0.1em] mb-3 min-h-[1.5em]"
          >
            {isGenerating ? PREMIUM_MESSAGES[messageIndex] : "読み込み中..."}
          </div>

          {/* ドットアニメーション */}
          <div className="flex justify-center gap-1.5 mb-6">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 bg-gold rounded-full"
                style={{
                  animation: "dot-bounce 1.4s infinite ease-in-out",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>

          {isGenerating && (
            <>
              {/* 経過時間と目安 */}
              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                <p className="text-sm text-text-muted mb-2">
                  経過時間: <span className="text-gold">{elapsedTime}</span>秒
                </p>
                <p className="text-xs text-text-muted">
                  ※ 詳細解説の生成には<span className="text-accent">約1〜2分</span>かかります
                </p>
              </div>

              {/* トリビア */}
              <div className="text-center">
                <p className="text-xs text-gold/70 mb-2 tracking-wider">💫 豆知識</p>
                <p className="text-xs text-text-muted leading-relaxed min-h-[2.5em]">
                  {TRIVIA[triviaIndex]}
                </p>
              </div>
            </>
          )}

          {/* 生成中の項目 */}
          {isGenerating && (
            <div className="text-xs text-text-muted/60 mt-4">
              恋愛編・未来編を含む全18項目を生成中
            </div>
          )}
        </div>

        {/* アニメーションスタイル */}
        <style jsx>{`
          @keyframes dot-bounce {
            0%, 80%, 100% {
              opacity: 0.3;
              transform: scale(0.8);
            }
            40% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
        `}</style>
      </main>
    );
  }

  // エラー状態
  if (error || !basicReading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Starfield starCount={60} />
        <BackgroundGlow variant="centered" />
        <div className="text-center relative z-10">
          <div className="text-4xl text-red-400 mb-4">⚠</div>
          <p className="text-text-muted mb-6">{error || "結果が見つかりませんでした"}</p>
          <Link
            href={`/result/${params.id}`}
            className="bg-gold text-bg px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors"
          >
            基本結果に戻る
          </Link>
        </div>
      </main>
    );
  }

  // 表示する解説（詳細解説があればそれを、なければ基本解説を使用）
  const displayReading = detailedReading || basicReading;

  return (
    <main className="min-h-screen">
      <Starfield starCount={60} />
      <BackgroundGlow variant="default" />

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
        {/* Hero Visual - 詳細解説ではテキストベースで表示（リアルタイムで詳細解説のキャッチフレーズを反映） */}
        <HeroVisual
          zodiacSign={displayReading.hero.zodiacSign}
          elementTitle={elementPattern ? elementPatternToTitle[elementPattern] || displayReading.hero.elementTitle : displayReading.hero.elementTitle}
          catchphrase={displayReading.hero.catchphrase}
          readingId={params.id}
          isPremium={true}
        />

        {/* Premium Badge */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold-light px-4 py-2 rounded-full text-sm">
            <span>✦</span>
            <span>詳細解説版</span>
            <span>✦</span>
          </span>
        </div>

        {/* Share Buttons (Hero下) - 詳細解説のheroを使用 */}
        <div className="mb-8">
          <ShareButtons 
            zodiacSign={displayReading.hero.zodiacSign}
            elementTitle={elementPattern ? elementPatternToTitle[elementPattern] || displayReading.hero.elementTitle : displayReading.hero.elementTitle}
            catchphrase={displayReading.hero.catchphrase}
          />
        </div>

        {/* Reading Sections with Parts */}
        <div className="mt-8">
          {displayReading.sections && displayReading.sections.map((section) => {
            // このセクションが属するパートを見つける
            const part = parts.find(
              (p) => section.id >= p.startId && section.id <= p.endId
            );
            const isFirstInPart = part && section.id === part.startId;

            return (
              <div key={section.id}>
                {/* パートヘッダー */}
                {isFirstInPart && part && (
                  <div className="mt-12 mb-6 py-5 border-t border-gold border-b border-b-divider">
                    <p className="text-xs text-gold tracking-[0.2em] uppercase mb-1">
                      {part.label}
                    </p>
                    <h2 className="font-serif text-lg">
                      {part.title}{" "}
                      <span className="text-gold-light">— {part.count}</span>
                    </h2>
                  </div>
                )}
                <ReadingSection section={section} />
              </div>
            );
          })}
        </div>

        {/* 相性診断CTA */}
        <div className="bg-card border border-[rgba(232,121,160,0.3)] rounded-xl p-6 md:p-8 my-8">
          <div className="text-center mb-4 md:mb-6">
            <span className="inline-block bg-[rgba(232,121,160,0.2)] text-pink text-xs font-semibold py-1 px-3 rounded-full mb-3 md:mb-4">
              💕 相性診断
            </span>
            <h3 className="font-serif text-lg md:text-xl text-text mb-2">
              気になる相手との相性は？
            </h3>
            <p className="text-xs md:text-sm text-text-muted">
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
                        <li key={item} className="text-xs text-text-muted flex items-center gap-2">
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
                        className="text-xs text-text-muted flex items-center gap-2"
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
        <div className="my-10">
          <ShareButtons 
            zodiacSign={displayReading.hero.zodiacSign}
            elementTitle={elementPattern ? elementPatternToTitle[elementPattern] || displayReading.hero.elementTitle : displayReading.hero.elementTitle}
            catchphrase={displayReading.hero.catchphrase}
          />
        </div>
      </div>

      {/* Compatibility Modal */}
      <CompatibilityModal
        isOpen={isCompatibilityModalOpen}
        onClose={() => setIsCompatibilityModalOpen(false)}
        person1ReadingId={params.id}
      />

      <Footer />
    </main>
  );
}
