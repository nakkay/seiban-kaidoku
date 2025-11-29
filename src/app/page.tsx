"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/Card";
import { Starfield } from "@/components/ui/Starfield";
import { BackgroundGlow } from "@/components/ui/BackgroundGlow";
import { BirthDataForm, StyleSelector } from "@/components/features/BirthDataForm";
import type { ReadingStyle } from "@/types";

export default function HomePage() {
  const router = useRouter();
  const [style, setStyle] = useState<ReadingStyle>("neutral");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    isTimeKnown: boolean;
    birthPlace: string;
    latitude?: number;
    longitude?: number;
    style: ReadingStyle;
  }) => {
    setIsLoading(true);
    
    // フォームデータをsessionStorageに保存してローディングページへ遷移
    const formData: {
      birthDate: { year: number; month: number; day: number };
      birthTime: { hour: number; minute: number; isKnown: boolean };
      birthPlace: string;
      latitude?: number;
      longitude?: number;
      style: ReadingStyle;
    } = {
      birthDate: {
        year: data.year,
        month: data.month,
        day: data.day,
      },
      birthTime: {
        hour: data.hour,
        minute: data.minute,
        isKnown: data.isTimeKnown,
      },
      birthPlace: data.birthPlace,
      style,
    };
    
    // 緯度経度が指定されている場合は追加
    if (data.latitude !== undefined && data.longitude !== undefined) {
      formData.latitude = data.latitude;
      formData.longitude = data.longitude;
    }
    
    sessionStorage.setItem("horoscopeFormData", JSON.stringify(formData));
    router.push("/loading");
  };

  return (
    <main className="min-h-screen relative">
      <BackgroundGlow />
      <Starfield starCount={60} />

      <Header />

      {/* Hero Section */}
      <section className="py-16 md:py-20 relative z-10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-[1.8fr_1fr] gap-4">
            {/* Main Hero Card */}
            <div
              className="md:row-span-2 rounded-xl p-7 min-h-[400px] flex flex-col justify-end relative overflow-hidden"
              style={{
                backgroundImage: `url('/main.png')`,
                backgroundPosition: "center top",
                backgroundSize: "cover",
              }}
            >
{/* 全体を薄く暗くするオーバーレイ */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "rgba(10, 14, 26, 0.2)",
                }}
              />
              {/* 下部グラデーション */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10, 14, 26, 0.95), transparent 70%)",
                }}
              />
              <div className="relative z-10">
                <p className="inline-block text-sm text-gold tracking-[0.15em] uppercase pb-3 mb-5 border-b border-divider">
                  西洋占星術 × AI — 日本語完全対応
                </p>
                <h1 className="font-serif text-[1.75rem] md:text-2xl leading-relaxed mb-4 tracking-wide">
                  生まれた瞬間の星空が、
                  <br />
                  あなたの<em className="not-italic text-gold-light">運命</em>
                  を映します
                </h1>
                <p className="text-base leading-loose">
                  出生日時と場所から、あなただけの星の配置を計算。
                  <br className="hidden md:block" />
                  AIが複雑なホロスコープを読み解き、わかりやすく解説します。
                </p>
              </div>
            </div>

            {/* Sub Card 1: AI */}
            <Card className="flex flex-col justify-center">
              <p className="text-xs text-accent tracking-[0.15em] uppercase mb-2">
                Technology
              </p>
              <h3 className="font-serif text-md mb-2.5">AIが読み解く</h3>
              <p className="text-sm text-text leading-relaxed">
                専門家でも難しいホロスコープの解釈を、AIがあなた専用にわかりやすく言語化します。
              </p>
            </Card>

            {/* Sub Card 2: Features */}
            <Card className="flex flex-col justify-center">
              <p className="text-xs text-accent tracking-[0.15em] uppercase mb-2">
                Reading
              </p>
              <h3 className="font-serif text-md mb-2.5">占いでわかること</h3>
              <ul className="flex flex-wrap gap-2 mt-3">
                {[
                  "基本の自分",
                  "感情・内面",
                  "コミュニケーション",
                  "恋愛・美意識",
                  "行動力・情熱",
                  "仕事・成功",
                  "人生の課題",
                  "傷と癒し",
                ].map((item) => (
                  <li
                    key={item}
                    className="bg-accent-subtle border border-accent/25 py-1.5 px-3.5 rounded-full text-sm text-accent tracking-wide"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-5 mt-4 pt-4 border-t border-divider">
                <span className="text-sm text-text-muted">
                  <span className="text-gold mr-1">✓</span> 無料
                </span>
                <span className="text-sm text-text-muted">
                  <span className="text-gold mr-1">✓</span> 約1分で結果表示
                </span>
                <span className="text-sm text-text-muted">
                  <span className="text-gold mr-1">✓</span> 登録不要
                </span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 relative z-10">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs text-accent tracking-[0.2em] uppercase mb-3">
              Comparison
            </p>
            <h2 className="font-serif text-lg tracking-wide">
              一般的な星座占いとの<em className="not-italic text-gold">違い</em>
            </h2>
            <p className="mt-3 text-sm text-text">
              テレビや雑誌の「星座占い」とは、精度がまったく異なります
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Normal horoscope */}
            <Card className="p-8">
              <div className="text-xl mb-4 opacity-80">⭐</div>
              <h3 className="font-serif text-md mb-4 pb-4 border-b border-divider">
                一般的な星座占い
              </h3>
              <p className="text-sm text-text leading-relaxed mb-3">
                太陽の位置だけを見て、12パターンに分類。同じ誕生月の人は、全員が同じ結果になります。
              </p>
              <p className="text-sm text-text-muted bg-white/[0.03] p-3 rounded-lg border-l-2 border-divider">
                例：「3月生まれはみんな魚座」
              </p>
            </Card>

            {/* Horoscope */}
            <Card variant="highlight" className="p-8 relative">
              <span className="absolute top-4 right-4 text-[0.6rem] tracking-[0.15em] text-gold bg-gold-subtle py-1 px-2.5 rounded-full">
                RECOMMENDED
              </span>
              <div className="text-xl mb-4 opacity-80">🌌</div>
              <h3 className="font-serif text-md mb-4 pb-4 border-b border-divider">
                ホロスコープ
              </h3>
              <p className="text-sm text-text leading-relaxed mb-3">
                太陽だけでなく、月・水星・金星などすべての惑星の位置を分析。生まれた日・時刻・場所によって、一人ひとり異なる結果に。
              </p>
              <p className="text-sm text-text-muted bg-white/[0.03] p-3 rounded-lg border-l-2 border-gold">
                例：「同じ3月1日生まれでも、朝と夜では結果が変わる」
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Style Section */}
      <section id="style" className="py-20 relative z-10">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs text-accent tracking-[0.2em] uppercase mb-3">
              Style
            </p>
            <h2 className="font-serif text-lg tracking-wide">
              お好みの<em className="not-italic text-gold">解説スタイル</em>
            </h2>
            <p className="mt-3 text-sm text-text">
              同じ結果でも、伝え方で印象は変わります。お好みのスタイルをお選びください（結果に反映されます）
            </p>
          </div>

          <StyleSelector value={style} onChange={setStyle} />
        </div>
      </section>

      {/* Form Section */}
      <section
        id="form"
        className="py-20 bg-bg-elevated border-t border-b border-divider relative z-10"
      >
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-xs text-accent tracking-[0.2em] uppercase mb-3">
              Input
            </p>
            <h2 className="font-serif text-lg tracking-wide">あなたの情報</h2>
          </div>

          <div className="max-w-[700px] mx-auto">
            <BirthDataForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </div>
      </section>

      {/* Explanation Section */}
      <section className="py-20 relative z-10">
        <div className="container">
          {/* What is Horoscope */}
          <div className="text-center mb-12">
            <p className="text-xs text-accent tracking-[0.2em] uppercase mb-3">
              What is Horoscope
            </p>
            <h2 className="font-serif text-lg tracking-wide">
              ホロスコープとは<em className="not-italic text-gold">？</em>
            </h2>
          </div>

          <Card
            variant="highlight"
            className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 md:gap-12 p-10 md:p-12"
          >
            <div className="flex items-center justify-center">
              <div
                className="w-40 h-40 rounded-full border border-gold/30 relative overflow-hidden flex items-center justify-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&q=80')`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  boxShadow:
                    "0 0 40px rgba(78, 184, 161, 0.2), inset 0 0 30px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(10, 14, 26, 0.3) 0%, rgba(10, 14, 26, 0.7) 100%)",
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-serif text-lg text-gold-light leading-snug mb-5">
                生まれた瞬間の星空を
                <br />
                図にしたもの
              </h3>
              <p className="text-sm text-text leading-loose mb-3">
                太陽・月・水星・金星・火星…といった天体が、あなたが生まれたその瞬間、どの位置にあったかを記録した「星空のスナップショット」。これがあなただけのホロスコープです。
              </p>
              <p className="text-sm text-text leading-loose">
                同じ日に生まれても、時刻や場所が違えば星の配置は異なります。だからこそホロスコープは、一人ひとり違う「あなただけの人生の設計図」になるのです。
              </p>
            </div>
          </Card>

          {/* How to Read */}
          <div className="text-center mt-20 mb-12">
            <p className="text-xs text-accent tracking-[0.2em] uppercase mb-3">
              How to Read
            </p>
            <h2 className="font-serif text-lg tracking-wide">
              ホロスコープの<em className="not-italic text-gold">読み方</em>
            </h2>
            <p className="mt-3 text-sm text-text">
              4つの要素の組み合わせで、あなたの物語が浮かび上がります
            </p>
          </div>

          {/* Reading Flow */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] gap-3 items-stretch mb-8">
            {[
              {
                icon: "☉",
                label: "惑星",
                role: "心の中の欲求",
                desc: "「認められたい」「愛されたい」——心の声を惑星が代弁",
              },
              {
                icon: "♌",
                label: "サイン",
                role: "表現スタイル",
                desc: "情熱的に求めるか、控えめに待つか——12通りの表れ方",
              },
              {
                icon: "⌂",
                label: "ハウス",
                role: "人生の舞台",
                desc: "仕事？恋愛？家庭？——どの分野で発揮されるか",
              },
              {
                icon: "△",
                label: "アスペクト",
                role: "相互作用",
                desc: "惑星同士の角度が、才能にも葛藤にもなる",
              },
            ].map((item, index) => (
              <div key={item.label} className="contents">
                <Card className="text-center p-6">
                  <div className="w-14 h-14 mx-auto mb-3.5 rounded-full bg-gradient-to-br from-gold/15 to-accent/10 border border-gold/30 flex items-center justify-center">
                    <span className="text-2xl text-gold">{item.icon}</span>
                  </div>
                  <h4 className="font-serif text-md mb-1">{item.label}</h4>
                  <p className="font-serif text-md text-accent tracking-wider mb-2.5">
                    {item.role}
                  </p>
                  <p className="text-sm text-text leading-relaxed">
                    {item.desc}
                  </p>
                </Card>
                {index < 3 && (
                  <div className="hidden md:flex items-center justify-center text-gold/40 text-xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Example */}
          <Card
            variant="highlight"
            className="text-center p-8 border-gold/25"
          >
            <span className="inline-block bg-gold text-bg text-xs font-semibold py-1.5 px-4 rounded-full mb-6 tracking-wider">
              例えば、こう読みます
            </span>
            <div className="flex items-center justify-center gap-2.5 flex-wrap mb-6">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 py-2.5 px-4 rounded-full text-sm">
                <span className="text-gold">♀</span>金星
              </span>
              <span className="text-text-muted text-sm">×</span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 py-2.5 px-4 rounded-full text-sm">
                <span className="text-gold">♌</span>獅子座
              </span>
              <span className="text-text-muted text-sm">×</span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 py-2.5 px-4 rounded-full text-sm">
                <span className="text-gold">⌂</span>第7ハウス
              </span>
            </div>
            <div className="pt-5 border-t border-divider">
              <div className="text-accent text-xl mb-3">↓</div>
              <p className="text-sm leading-relaxed">
                恋愛において
                <em className="not-italic text-gold-light font-medium">
                  ドラマチックで情熱的な愛情表現
                </em>
                を好み、
                <br className="hidden md:block" />
                パートナーとの関係を人生の中心に置く傾向がある
              </p>
            </div>
          </Card>

          {/* Planets */}
          <div className="text-center mt-20 mb-12">
            <p className="text-xs text-accent tracking-[0.2em] uppercase mb-3">
              Planets
            </p>
            <h2 className="font-serif text-lg tracking-wide">
              7つの惑星が象徴する<em className="not-italic text-gold">もの</em>
            </h2>
            <p className="mt-3 text-sm text-text">
              それぞれの惑星は、あなたの心の中にある異なる側面を映し出します
            </p>
          </div>

          {/* Luminaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Sun */}
            <Card
              variant="highlight"
              className="flex gap-5 p-7 border-gold/25"
            >
              <div className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center bg-[radial-gradient(circle,rgba(212,175,85,0.3)_0%,rgba(212,175,85,0.05)_70%)] border border-gold/40">
                <span className="text-[1.75rem] text-gold">☉</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
                  <span className="font-serif text-md">太陽</span>
                  <span className="text-xs text-text-muted">Sun</span>
                  <span className="text-sm bg-gold/20 text-gold py-1 px-2.5 rounded-full tracking-wider">
                    外に見せる自分
                  </span>
                </div>
                <p className="text-sm text-text leading-relaxed">
                  あなたの<em className="not-italic text-gold-light">本質</em>
                  そのもの。「自分は何者か」「どう生きたいか」という核心的なアイデンティティ。一般的な星座占いの「あなたは◯◯座」は、この太陽のサインです。
                </p>
              </div>
            </Card>

            {/* Moon */}
            <Card
              variant="highlight"
              className="flex gap-5 p-7 border-gold/25"
            >
              <div className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center bg-[radial-gradient(circle,rgba(78,184,161,0.25)_0%,rgba(78,184,161,0.05)_70%)] border border-accent/40">
                <span className="text-[1.75rem] text-accent">☽</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
                  <span className="font-serif text-md">月</span>
                  <span className="text-xs text-text-muted">Moon</span>
                  <span className="text-sm bg-gold/20 text-gold py-1 px-2.5 rounded-full tracking-wider">
                    素の自分
                  </span>
                </div>
                <p className="text-sm text-text leading-relaxed">
                  あなたの<em className="not-italic text-gold-light">感情</em>と
                  <em className="not-italic text-gold-light">内面</em>
                  。安心できる環境、心が求めるもの、無意識の反応パターン。親しい人の前でだけ見せる顔、それが月の領域です。
                </p>
              </div>
            </Card>
          </div>

          {/* Other Planets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                symbol: "☿",
                name: "水星",
                en: "Mercury",
                keywords: ["知性", "コミュニケーション"],
                desc: "どのように考え、学び、伝えるか。論理的か直感的か、話し上手か聞き上手か——思考と対話のスタイル。",
              },
              {
                symbol: "♀",
                name: "金星",
                en: "Venus",
                keywords: ["愛", "美", "価値観"],
                desc: "何を美しいと感じ、どう愛するか。「好きになるタイプ」や「愛情表現の仕方」を教えてくれる惑星。",
              },
              {
                symbol: "♂",
                name: "火星",
                en: "Mars",
                keywords: ["行動力", "情熱"],
                desc: "欲しいものをどう手に入れるか、何に情熱を燃やすか。金星が「受け取る愛」なら、火星は「追いかける愛」。",
              },
              {
                symbol: "♃",
                name: "木星",
                en: "Jupiter",
                keywords: ["拡大", "幸運"],
                desc: "成長したい方向、恵まれやすい分野。木星のある領域では物事がスムーズに広がりやすい。",
              },
              {
                symbol: "♄",
                name: "土星",
                en: "Saturn",
                keywords: ["責任", "試練"],
                desc: "乗り越えることで最も成長できる領域。土星の課題に向き合うことで、人生に揺るぎない土台が築かれる。",
              },
            ].map((planet) => (
              <Card key={planet.name} className="p-6">
                <div className="text-[1.75rem] text-gold mb-3">
                  {planet.symbol}
                </div>
                <div className="mb-3 pb-3 border-b border-divider">
                  <h4 className="font-serif text-base mb-2">
                    {planet.name}
                    <span className="font-base text-xs text-text-muted ml-2">
                      {planet.en}
                    </span>
                  </h4>
                  <div className="flex gap-1.5 flex-wrap">
                    {planet.keywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-sm bg-accent-subtle text-accent py-1 px-2.5 rounded-full tracking-wide"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-text leading-relaxed">
                  {planet.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
