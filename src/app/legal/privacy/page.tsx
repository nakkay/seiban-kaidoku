import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "プライバシーポリシー - 星盤解読",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg text-text">
      <Header showCta={false} />

      <div className="container py-16">
        <h1 className="font-serif text-xl text-gold mb-10">
          プライバシーポリシー
        </h1>

        <div className="space-y-8 max-w-2xl text-sm leading-relaxed">
          <section>
            <h2 className="text-base text-gold-light mb-3">1. 収集する情報</h2>
            <p className="text-text-muted">
              当サービスでは、ホロスコープ診断のために以下の情報を収集します。
            </p>
            <ul className="list-disc list-inside mt-2 text-text-muted space-y-1">
              <li>生年月日</li>
              <li>出生時刻（任意）</li>
              <li>出生地</li>
              <li>決済に関する情報（Stripeを通じて処理）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base text-gold-light mb-3">2. 情報の利用目的</h2>
            <p className="text-text-muted">
              収集した情報は、以下の目的でのみ使用します。
            </p>
            <ul className="list-disc list-inside mt-2 text-text-muted space-y-1">
              <li>ホロスコープ診断結果の生成</li>
              <li>決済処理</li>
              <li>サービスの改善</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base text-gold-light mb-3">3. 情報の第三者提供</h2>
            <p className="text-text-muted">
              お客様の個人情報は、法令に基づく場合を除き、第三者に提供することはありません。
              ただし、決済処理のためStripe社にカード情報が送信されます。
            </p>
          </section>

          <section>
            <h2 className="text-base text-gold-light mb-3">4. データの保存</h2>
            <p className="text-text-muted">
              診断結果は、再閲覧のためサーバーに保存されます。
              データの削除を希望される場合は、お問い合わせください。
            </p>
          </section>

          <section>
            <h2 className="text-base text-gold-light mb-3">5. Cookieの使用</h2>
            <p className="text-text-muted">
              当サービスでは、サービス提供のために必要最低限のCookieを使用しています。
            </p>
          </section>

          <section>
            <h2 className="text-base text-gold-light mb-3">6. お問い合わせ</h2>
            <p className="text-text-muted">
              プライバシーに関するお問い合わせは、以下までご連絡ください。<br />
              メール：info@overrrr.com
            </p>
          </section>

          <p className="text-xs text-text-muted pt-4 border-t border-divider">
            制定日：2025年1月1日
          </p>
        </div>
      </div>

      <Footer />
    </main>
  );
}

