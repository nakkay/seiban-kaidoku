import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "特定商取引法に基づく表記 - 星盤解読",
};

export default function TokushohoPage() {
  return (
    <main className="min-h-screen bg-bg text-text">
      <Header showCta={false} />

      <div className="container py-16">
        <h1 className="font-serif text-xl text-gold mb-10">
          特定商取引法に基づく表記
        </h1>

        <div className="space-y-8 max-w-2xl">
          <dl className="space-y-6">
            <div>
              <dt className="text-xs text-text-muted mb-1">販売業者</dt>
              <dd className="text-sm">株式会社BLUE MONDAY</dd>
            </div>

            <div>
              <dt className="text-xs text-text-muted mb-1">所在地</dt>
              <dd className="text-sm">東京都中央区銀座1-12-4</dd>
            </div>

            <div>
              <dt className="text-xs text-text-muted mb-1">連絡先</dt>
              <dd className="text-sm">
                メール：info@bluemonday.jp<br />
                ※電話番号は請求があれば遅滞なく開示いたします
              </dd>
            </div>

            <div>
              <dt className="text-xs text-text-muted mb-1">販売価格</dt>
              <dd className="text-sm">
                詳細解説：500円（税込）<br />
                相性診断：500円（税込）
              </dd>
            </div>

            <div>
              <dt className="text-xs text-text-muted mb-1">支払方法</dt>
              <dd className="text-sm">クレジットカード（Stripe決済）</dd>
            </div>

            <div>
              <dt className="text-xs text-text-muted mb-1">支払時期</dt>
              <dd className="text-sm">購入時に即時決済</dd>
            </div>

            <div>
              <dt className="text-xs text-text-muted mb-1">商品の引渡し時期</dt>
              <dd className="text-sm">決済完了後、即時にWeb上で閲覧可能</dd>
            </div>

            <div>
              <dt className="text-xs text-text-muted mb-1">返品・キャンセル</dt>
              <dd className="text-sm">
                デジタルコンテンツという商品の性質上、提供後の返品・返金はお受けできません。
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <Footer />
    </main>
  );
}

