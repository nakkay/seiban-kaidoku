import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "利用規約",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg text-text">
      <Header showCta={false} />

      <div className="container py-16">
        <h1 className="font-serif text-xl text-gold mb-10">
          利用規約
        </h1>

        <div className="space-y-8 max-w-2xl text-sm leading-relaxed">
          <section>
            <h2 className="text-base text-gold-light mb-3">1. サービスの内容</h2>
            <p className="text-text-muted">
              「星盤解読」（以下「本サービス」）は、西洋占星術に基づくホロスコープ診断を提供するエンターテインメントサービスです。
              AIによる解釈は、参考情報としてお楽しみください。
            </p>
          </section>

          <section>
            <h2 className="text-base text-gold-light mb-3">2. 免責事項</h2>
            <p className="text-text-muted">
              本サービスの診断結果は、占星術に基づくエンターテインメントであり、
              人生の重要な決断や医療・法律などの専門的判断の根拠とすることはできません。
              診断結果の利用はお客様の自己責任となります。
            </p>
          </section>

          <section>
            <h2 className="text-base text-gold-light mb-3">3. 有料サービス</h2>
            <p className="text-text-muted">
              詳細解説および相性診断は有料サービスです。
              デジタルコンテンツという性質上、購入後の返金はお受けできません。
            </p>
          </section>

          <section>
            <h2 className="text-base text-gold-light mb-3">4. 禁止事項</h2>
            <ul className="list-disc list-inside text-text-muted space-y-1">
              <li>本サービスの不正利用</li>
              <li>他者になりすましての利用</li>
              <li>診断結果の商用利用・再配布</li>
              <li>サービスへの不正アクセス</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base text-gold-light mb-3">5. 知的財産権</h2>
            <p className="text-text-muted">
              本サービスのコンテンツ（デザイン、テキスト、画像等）の著作権は、
              当社または正当な権利者に帰属します。
            </p>
          </section>

          <section>
            <h2 className="text-base text-gold-light mb-3">6. サービスの変更・終了</h2>
            <p className="text-text-muted">
              当社は、事前の通知なくサービス内容の変更または終了を行う場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-base text-gold-light mb-3">7. 準拠法・管轄</h2>
            <p className="text-text-muted">
              本規約は日本法に準拠し、紛争が生じた場合は東京地方裁判所を第一審の専属的合意管轄裁判所とします。
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


