"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Starfield } from "@/components/ui";

// ローディングメッセージ
const LOADING_MESSAGES = [
  "2人の星の配置を計算しています",
  "相性スコアを分析しています",
  "ふたりの関係性を読み解いています",
  "コミュニケーションの傾向を探っています",
  "価値観の相性を確認中",
  "長期的な関係性を予測しています",
  "AIが診断を生成しています",
  "2人だけの相性診断を仕上げています",
];

// 豆知識
const TRIVIA = [
  "太陽星座同士の相性だけでなく、月星座の相性も重要です",
  "金星の位置は恋愛傾向を、火星は行動パターンを示します",
  "同じエレメント（火・地・風・水）同士は相性が良いとされています",
  "7ハウスは「パートナーシップの部屋」と呼ばれています",
  "シナストリーとは2人のチャートを重ね合わせて見る技法です",
];


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

interface PageProps {
  params: { id: string };
}

// 相性診断セクション
interface CompatibilitySection {
  id: number;
  title: string;
  icon: string;
  catch: string;
  keyPointsTitle: string;
  keyPoints: string[];
  description: string;
  isCaution?: boolean;
}

// シェアボタンコンポーネント
function ShareButtons({
  person1Zodiac,
  person2Zodiac,
  score,
  catchphrase,
}: {
  person1Zodiac: string;
  person2Zodiac: string;
  score: number;
  catchphrase: string;
}) {
  const [copied, setCopied] = useState(false);

  const generateShareText = () => {
    const firstLine = `【${person1Zodiac} × ${person2Zodiac}】相性${score}%！${catchphrase}`;
    const secondLine = `AIが読み解く、2人だけの相性診断。あなたも試してみて✨`;
    const hashtags = `#星盤解読 #相性診断 #西洋占星術`;
    return `${firstLine}\n\n${secondLine}\n\n${hashtags}`;
  };

  const handleShare = (platform: "x" | "line" | "copy") => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = generateShareText();

    if (platform === "copy") {
      navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }

    if (platform === "x") {
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      window.open(shareUrl, "_blank", "width=600,height=400");
    } else if (platform === "line") {
      // LINEはlocation.hrefで遷移（iOSでアプリを開くため）
      const shareUrl = `https://line.me/R/share?text=${encodeURIComponent(text + "\n" + url)}`;
      window.location.href = shareUrl;
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
        onClick={() => handleShare("copy")}
        className="inline-flex items-center gap-1.5 py-2.5 px-5 md:py-3 md:px-6 border border-accent rounded-full text-accent text-sm font-medium bg-transparent hover:bg-accent-subtle transition-all"
      >
        {copied ? "✓ コピー完了" : "🔗 URLコピー"}
      </button>
    </div>
  );
}

// セクションコンポーネント
function CompatibilitySectionCard({ section, index }: { section: CompatibilitySection; index: number }) {
  const isCaution = section.isCaution || section.title === "衝突ポイント";
  
  return (
    <section className={`border-b border-divider py-8 last:border-b-0 ${isCaution ? "caution" : ""}`}>
      <div className="flex items-center gap-3 mb-4">
        <div 
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
            isCaution 
              ? "bg-[rgba(220,80,80,0.15)]" 
              : "bg-[rgba(232,121,160,0.15)]"
          }`}
        >
          {section.icon}
        </div>
        <div className="flex-1">
          <div className={`text-xs tracking-widest ${isCaution ? "text-[#dc5050]" : "text-pink"}`}>
            {String(index + 1).padStart(2, "0")}
          </div>
          <h2 className="font-serif text-base text-text">{section.title}</h2>
        </div>
      </div>

      <div className="md:pl-[52px]">
        <h3 className={`font-serif text-lg mb-3 leading-snug ${isCaution ? "text-[#dc5050]" : "text-gold-light"}`}>
          {section.catch}
        </h3>

        <div className="bg-card border border-card-border rounded-xl p-5 mb-4">
          <div className="text-sm text-gold mb-3 tracking-wider">
            {section.keyPointsTitle}
          </div>
          <ul className="space-y-2">
            {section.keyPoints?.map((point, i) => (
              <li 
                key={i} 
                className="relative pl-5 text-sm text-text opacity-90"
              >
                <span 
                  className={`absolute left-0 text-xs ${isCaution ? "text-[#dc5050]" : "text-pink"}`}
                >
                  {isCaution ? "⚠" : "♡"}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-text opacity-95 leading-relaxed">
          {section.description}
        </p>
      </div>
    </section>
  );
}

// ローディング画面コンポーネント
function LoadingScreen({ 
  elapsedTime, 
  messageIndex,
  triviaIndex,
  isTransitioning,
}: { 
  elapsedTime: number; 
  messageIndex: number;
  triviaIndex: number;
  isTransitioning: boolean;
}) {
  // ドットアニメーション用（3つのドットが順番に光る）
  const dotIndex = Math.floor(elapsedTime / 0.5) % 3;
  
  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-bg">
      <Starfield />
      
      {/* 微かなグロー */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 40%, rgba(232, 121, 160, 0.08) 0%, transparent 50%)",
        }}
      />

      {/* メインコンテンツ */}
      <div className="relative z-10 flex flex-col items-center px-4 max-w-sm w-full">
        
        {/* シンプルなスピナー */}
        <div className="relative w-16 h-16 mb-8">
          <div className="absolute inset-0 rounded-full border border-pink/20" />
          <div 
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-pink/60"
            style={{ animation: "spin 1.5s linear infinite" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl opacity-70">♡</span>
          </div>
        </div>

        {/* メッセージ */}
        <p
          className={`font-serif text-base text-text/90 tracking-wide text-center mb-6 transition-opacity duration-300 ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          {LOADING_MESSAGES[messageIndex]}
        </p>

        {/* 進行ドット */}
        <div className="flex gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i <= dotIndex ? "bg-pink/70" : "bg-pink/20"
              }`}
            />
          ))}
        </div>

        {/* 経過時間と注釈 */}
        <p className="text-xs text-text-muted/60 mb-8">
          {elapsedTime}秒経過 ・ 1〜2分ほどかかります
        </p>

        {/* 豆知識 */}
        <div className="border-t border-divider/50 pt-6 w-full text-center">
          <p className="text-xs text-pink/60 tracking-wider mb-2">💡 TRIVIA</p>
          <p className="text-xs text-text-muted/70 leading-relaxed">
            {TRIVIA[triviaIndex]}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CompatibilityResultPage({ params }: PageProps) {
  const { id } = params;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const hasStartedRef = useRef(false);

  // ページトップにスクロール
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ローディング中かどうか
  const isLoading = !data || !data.reading;

  // 経過時間カウント
  useEffect(() => {
    if (!isLoading) {
      startTimeRef.current = null;
      return;
    }

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }

    const timer = setInterval(() => {
      if (startTimeRef.current) {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading]);

  // メッセージローテーション（5秒ごと）
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoading]);

  // 豆知識ローテーション（8秒ごと）
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setTriviaIndex((prev) => (prev + 1) % TRIVIA.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isLoading]);


  // 決済確認とAI生成
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const processCompatibility = async () => {
      try {
        // URLパラメータから支払い完了を確認
        const urlParams = new URLSearchParams(window.location.search);
        const isPaidParam = urlParams.get("paid") === "1";

        let isPaid = false;

        if (isPaidParam) {
          // URLからパラメータを削除
          window.history.replaceState({}, "", `/compatibility/${id}`);

          // ローカル開発用: mark-paid APIを呼び出す
          const markPaidRes = await fetch(`/api/compatibility/${id}/mark-paid`, { method: "POST" });
          const markPaidData = await markPaidRes.json();
          isPaid = markPaidData.is_paid || markPaidData.success;
          
        }

        // データを取得
        const response = await fetch(`/api/compatibility/${id}?t=${Date.now()}`, {
          cache: "no-store",
        });
        const fetchedData = await response.json();

        if (!response.ok) {
          throw new Error(fetchedData.error || "データの取得に失敗しました");
        }

        // 決済済みでまだAI生成されていない場合
        const shouldGenerate = !fetchedData.reading && (fetchedData.isPaid || isPaid);
        
        if (shouldGenerate) {
          // AI生成を開始
          const generateResponse = await fetch("/api/compatibility/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ compatibilityId: id }),
          });

          const generateData = await generateResponse.json();

          if (!generateResponse.ok) {
            throw new Error(generateData.error || "診断生成に失敗しました");
          }

          // 再度データを取得
          const refreshResponse = await fetch(`/api/compatibility/${id}?t=${Date.now()}`, {
            cache: "no-store",
          });
          const refreshedData = await refreshResponse.json();
          setData(refreshedData);
        } else if (fetchedData.reading) {
          // AI生成済みの場合のみデータをセット
          setData(fetchedData);
        }
      } catch (err) {
        console.error("[Compatibility] Error:", err);
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      }
    };

    processCompatibility();
  }, [id]);


  // エラー
  if (error) {
    return (
      <div className="min-h-screen relative bg-bg">
        <Starfield />
        <main className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-4xl text-pink mb-4">😢</div>
            <div className="text-text mb-4">{error}</div>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-bg font-semibold rounded-full"
            >
              トップページへ
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // データなし or AI生成待ち（readingがない）→ ローディング画面
  if (!data || !data.reading) {
    return (
      <LoadingScreen 
        elapsedTime={elapsedTime} 
        messageIndex={messageIndex}
        triviaIndex={triviaIndex}
        isTransitioning={isTransitioning}
      />
    );
  }

  // データを取得
  const person1Zodiac = data.person1?.zodiacSign || "魚座";
  const person1ElementTitle = data.person1?.elementPattern 
    ? elementPatternToTitle[data.person1.elementPattern] || data.person1.elementTitle 
    : data.person1?.elementTitle || "水の刻印";
  const person1Catchphrase = data.person1?.catchphrase || "深海に潜む直感の人";
  const person1ZodiacFile = zodiacFileMap[person1Zodiac] || "pisces";

  const person2ZodiacEn = data.person2?.zodiac || "taurus";
  const person2Zodiac = zodiacToJapanese[person2ZodiacEn] || "牡牛座";
  const person2ElementTitle = data.person2?.elementPattern 
    ? elementPatternToTitle[data.person2.elementPattern] || "地の刻印"
    : "地の刻印";
  const person2Catchphrase = data.person2?.catchphrase || "揺るがぬ美の守護者";
  const person2ZodiacFile = zodiacFileMap[person2Zodiac] || zodiacFileMap[zodiacToJapanese[person2ZodiacEn]] || "taurus";

  const score = data.score || 0;
  const catchphrase = data.catchphrase || "診断生成中...";
  const sections: CompatibilitySection[] = data.reading?.sections || [];

  return (
    <div className="min-h-screen relative bg-bg">
      <Starfield />

      {/* ヘッダー */}
      <header className="py-5 border-b border-divider relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-md text-gold tracking-[0.1em]">
                星盤解読
              </span>
              <span className="text-sm text-text-muted tracking-wider">
                HOROSCOPE
              </span>
            </Link>
            {/* Badge */}
            <span 
              className="text-bg text-xs font-semibold py-1 px-3 rounded-full tracking-wider"
              style={{ background: "linear-gradient(to right, #e879a0, #f4a5c0)" }}
            >
              💕 相性診断
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 max-w-[720px]">
        {/* ヒーローセクション */}
        <div 
          className="rounded-2xl p-4 py-6 md:p-12 text-center my-6 relative overflow-hidden aspect-[4/3] md:aspect-auto flex flex-col justify-center"
          style={{
            background: `linear-gradient(180deg, rgba(15, 22, 40, 0.5) 0%, rgba(60, 30, 50, 0.7) 100%)`,
          }}
        >
          {/* 背景グラデーション */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at 50% 80%, rgba(232, 121, 160, 0.2) 0%, transparent 60%)",
            }}
          />

          <div className="relative z-10">
            {/* 2人の星座 */}
            <div className="flex justify-center items-start gap-3 md:gap-12 mb-3 md:mb-6">
              {/* Person 1 */}
              <div className="text-center flex-1 max-w-[150px] md:max-w-[220px]">
                <div className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] mx-auto mb-2 md:mb-3 rounded-xl overflow-hidden border border-[rgba(212,175,85,0.3)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-[rgba(10,14,26,0.5)]">
                  <Image
                    src={`/zodiac/${person1ZodiacFile}.png`}
                    alt={person1Zodiac}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs md:text-base text-gold mb-0.5 md:mb-1 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{person1Zodiac} × {person1ElementTitle}</p>
                <p className="font-serif text-sm md:text-md text-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{person1Catchphrase}</p>
              </div>

              {/* ハートアイコン */}
              <div className="text-pink text-2xl md:text-3xl animate-pulse mt-8 md:mt-12">♡</div>

              {/* Person 2 */}
              <div className="text-center flex-1 max-w-[150px] md:max-w-[220px]">
                <div className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] mx-auto mb-2 md:mb-3 rounded-xl overflow-hidden border border-[rgba(232,121,160,0.3)] shadow-[0_8px_32px_rgba(0,0,0,0.3)] bg-[rgba(10,14,26,0.5)]">
                  <Image
                    src={`/zodiac/${person2ZodiacFile}.png`}
                    alt={person2Zodiac}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs md:text-base text-gold mb-0.5 md:mb-1 tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{person2Zodiac} × {person2ElementTitle}</p>
                <p className="font-serif text-sm md:text-md text-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{person2Catchphrase}</p>
              </div>
            </div>

            {/* 相性スコア */}
            <div className="mb-2 md:mb-4">
              <div className="text-xs text-pink tracking-widest mb-1 md:mb-2">COMPATIBILITY SCORE</div>
              <div 
                className={`font-serif text-5xl md:text-7xl ${
                  score >= 80 
                    ? "text-pink drop-shadow-[0_0_30px_rgba(232,121,160,0.6)]" 
                    : score >= 60 
                      ? "text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]" 
                      : score >= 40 
                        ? "text-[#ffb464] drop-shadow-[0_0_30px_rgba(255,180,100,0.4)]" 
                        : "text-[#dc5050] drop-shadow-[0_0_30px_rgba(220,80,80,0.4)]"
                }`}
              >
                {score}
                <span className="text-2xl md:text-3xl">%</span>
              </div>
            </div>

            {/* キャッチフレーズ */}
            <p className="font-serif text-base md:text-xl text-text">
              {catchphrase}
            </p>
          </div>
        </div>

        {/* シェアボタン */}
        <div className="my-8">
          <ShareButtons
            person1Zodiac={person1Zodiac}
            person2Zodiac={person2Zodiac}
            score={score}
            catchphrase={catchphrase}
          />
        </div>

        {/* セクション */}
        {sections.length > 0 && (
          <div className="bg-card border border-card-border rounded-2xl p-6 md:p-8 my-8">
            {sections.map((section, index) => (
              <CompatibilitySectionCard key={section.id} section={section} index={index} />
            ))}
          </div>
        )}

        {/* 最下部シェアボタン */}
        <div className="my-8">
          <ShareButtons
            person1Zodiac={person1Zodiac}
            person2Zodiac={person2Zodiac}
            score={score}
            catchphrase={catchphrase}
          />
        </div>

      </main>

      {/* フッター */}
      <footer className="border-t border-divider py-8 text-center text-xs text-text-muted">
        <p>© 2024 星盤解読 All Rights Reserved.</p>
      </footer>
    </div>
  );
}
