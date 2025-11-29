"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Starfield } from "@/components/ui/Starfield";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";

// より多くのメッセージで待機時間を演出
const messages = [
  "星の配置を計算しています",
  "惑星の位置を読み解いています",
  "太陽と月の関係を分析しています",
  "アスペクトを解析しています",
  "ハウスの意味を読み取っています",
  "あなたの個性を言語化しています",
  "AIが解説を生成しています",
  "もう少しで完成です",
];

// 豆知識（待ち時間のエンターテイメント）
const trivia = [
  "ホロスコープは「時を見る」という意味のギリシャ語が語源です",
  "太陽星座だけでなく、月星座も性格に大きく影響します",
  "アセンダント（ASC）は「第一印象」を表すと言われています",
  "金星の位置は恋愛傾向を、火星は行動パターンを示します",
  "木星は「幸運の星」、土星は「試練の星」と呼ばれます",
  "同じ誕生日でも、生まれた時刻で結果が変わります",
  "水星逆行は年に約3回起こり、コミュニケーションに影響するとされます",
];

const planetSymbols = ["☉", "☽", "☿", "♀", "♂", "♃", "♄", "⚷"];

export default function LoadingPage() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTriviaTransitioning, setIsTriviaTransitioning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const messageRef = useRef<HTMLDivElement>(null);
  const hasCalledApi = useRef(false);

  // 経過時間をカウント
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // メッセージを段階的に変更（5秒ごと）
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % messages.length);
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 豆知識を段階的に変更（8秒ごと）
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTriviaTransitioning(true);
      setTimeout(() => {
        setTriviaIndex((prev) => (prev + 1) % trivia.length);
        setIsTriviaTransitioning(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // API呼び出し
  const calculateHoroscope = useCallback(async () => {
    if (hasCalledApi.current) return;
    hasCalledApi.current = true;

    try {
      // sessionStorageからフォームデータを取得
      const formDataStr = sessionStorage.getItem("horoscopeFormData");
      
      if (!formDataStr) {
        // フォームデータがない場合はトップページへ戻る
        router.push("/");
        return;
      }

      const formData = JSON.parse(formDataStr);

      // API呼び出し
      const response = await fetch("/api/horoscope/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "エラーが発生しました");
        return;
      }

      // sessionStorageをクリア
      sessionStorage.removeItem("horoscopeFormData");

      // OGP画像をプリロード（結果ページでの表示を高速化）
      const ogImage = new Image();
      ogImage.src = `/api/og/${result.id}`;
      
      // 画像のプリロードを待つ（最大3秒でタイムアウト）
      await Promise.race([
        new Promise<void>((resolve) => {
          ogImage.onload = () => resolve();
          ogImage.onerror = () => resolve(); // エラーでも続行
        }),
        new Promise<void>((resolve) => setTimeout(resolve, 3000)),
      ]);

      // 結果ページへ遷移
      router.push(`/result/${result.id}`);
    } catch (err) {
      console.error("API error:", err);
      setError("ネットワークエラーが発生しました。再度お試しください。");
    }
  }, [router]);

  useEffect(() => {
    calculateHoroscope();
  }, [calculateHoroscope]);

  // 経過時間のフォーマット
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}分${secs}秒`;
    }
    return `${secs}秒`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative">
      <Starfield starCount={80} showShootingStars />
      <BackgroundGlow variant="centered" />

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 max-w-md">
        {/* ホロスコープビジュアル */}
        <div className="relative w-[240px] h-[240px]">
          {/* 外側の円（黄道帯） */}
          <div
            className="absolute inset-0 rounded-full border border-gold/30 animate-[rotate-slow_60s_linear_infinite]"
            style={{
              boxShadow: "inset 0 0 20px rgba(212, 175, 85, 0.1)",
            }}
          >
            <div className="absolute -inset-1 rounded-full border border-dashed border-gold/15" />
          </div>

          {/* 中間の円 */}
          <div
            className="absolute rounded-full border border-accent/25 animate-[rotate-slow_45s_linear_infinite_reverse]"
            style={{
              top: "25px",
              left: "25px",
              width: "calc(100% - 50px)",
              height: "calc(100% - 50px)",
            }}
          />

          {/* 内側の円 */}
          <div
            className="absolute rounded-full border border-gold/20 animate-[rotate-slow_30s_linear_infinite]"
            style={{
              top: "50px",
              left: "50px",
              width: "calc(100% - 100px)",
              height: "calc(100% - 100px)",
            }}
          />

          {/* 惑星シンボル */}
          {planetSymbols.map((symbol, index) => {
            const positions = [
              { top: "-8px", left: "50%", transform: "translateX(-50%)" },
              { top: "20%", right: "5%" },
              { top: "50%", right: "-12px", transform: "translateY(-50%)" },
              { bottom: "20%", right: "5%" },
              { bottom: "-8px", left: "50%", transform: "translateX(-50%)" },
              { bottom: "20%", left: "5%" },
              { top: "50%", left: "-12px", transform: "translateY(-50%)" },
              { top: "20%", left: "5%" },
            ];
            const pos = positions[index];
            const isAccent = index === 4 || index === 7;

            return (
              <span
                key={index}
                className="absolute text-lg drop-shadow-[0_0_10px_rgba(232,200,120,0.5)]"
                style={{
                  ...pos,
                  color: isAccent ? "#4eb8a1" : "#e8c878",
                  opacity: 0,
                  animation: `appear-planet 0.5s forwards ${0.3 + index * 0.2}s`,
                }}
              >
                {symbol}
              </span>
            );
          })}

          {/* アスペクト線 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px]">
            {[
              { width: "80px", rotation: "30deg", delay: "2s" },
              { width: "60px", rotation: "120deg", delay: "2.2s" },
              { width: "70px", rotation: "210deg", delay: "2.4s" },
              { width: "50px", rotation: "300deg", delay: "2.6s" },
            ].map((line, index) => (
              <div
                key={index}
                className="absolute top-1/2 left-1/2 h-px"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(212, 175, 85, 0.3), transparent)",
                  transformOrigin: "left center",
                  transform: `rotate(${line.rotation})`,
                  opacity: 0,
                  width: line.width,
                  animation: `draw-line 0.8s forwards ${line.delay}`,
                }}
              />
            ))}
          </div>

          {/* 中心の太陽 */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[2rem] text-gold"
            style={{
              textShadow: "0 0 30px rgba(212, 175, 85, 0.6)",
              animation: "pulse-sun 2s infinite ease-in-out",
            }}
          >
            ✦
          </div>
        </div>

        {/* テキスト */}
        <div className="text-center w-full">
          {error ? (
            <>
              <div className="font-serif text-md text-red-400 tracking-[0.1em] mb-4">
                エラーが発生しました
              </div>
              <p className="text-sm text-text mb-6">{error}</p>
              <button
                onClick={() => router.push("/")}
                className="bg-gold text-bg px-6 py-3 rounded-lg font-medium hover:bg-gold-light transition-colors"
              >
                もう一度試す
              </button>
            </>
          ) : (
            <>
              {/* メインメッセージ */}
              <div
                ref={messageRef}
                className="font-serif text-md text-text tracking-[0.1em] mb-3 min-h-[1.5em] transition-opacity duration-300"
                style={{ opacity: isTransitioning ? 0 : 1 }}
              >
                {messages[messageIndex]}
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

              {/* 経過時間と目安 */}
              <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10 w-[280px] mx-auto">
                <p className="text-xs text-text-muted mb-2">
                  経過時間: <span className="text-gold">{formatTime(elapsedTime)}</span>
                </p>
                <p className="text-xs text-text-muted">
                  ※ AIによる解説生成に<span className="text-accent">約1分</span>かかります
                </p>
              </div>

              {/* 豆知識 */}
              <div className="text-center">
                <p className="text-xs text-gold/70 mb-2 tracking-wider">💫 豆知識</p>
                <p
                  className="text-xs text-text-muted leading-relaxed transition-opacity duration-300 min-h-[2.5em]"
                  style={{ opacity: isTriviaTransitioning ? 0 : 1 }}
                >
                  {trivia[triviaIndex]}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* CSS アニメーション */}
      <style jsx>{`
        @keyframes appear-planet {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes draw-line {
          from {
            opacity: 0;
            width: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes pulse-sun {
          0%,
          100% {
            opacity: 0.8;
            text-shadow: 0 0 30px rgba(212, 175, 85, 0.6);
          }
          50% {
            opacity: 1;
            text-shadow: 0 0 50px rgba(212, 175, 85, 0.9);
          }
        }
        @keyframes dot-bounce {
          0%,
          80%,
          100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
