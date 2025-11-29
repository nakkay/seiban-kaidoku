import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Starfield } from "@/components/ui/Starfield";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-bg text-text flex flex-col">
      <Header showCta={false} />
      
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <Starfield />
        
        <div className="relative z-10 text-center px-4">
          <div className="text-6xl mb-6 opacity-60">🌙</div>
          <h1 className="font-serif text-2xl text-gold mb-4">
            ページが見つかりません
          </h1>
          <p className="text-sm text-text-muted mb-8 max-w-md mx-auto">
            お探しのページは存在しないか、移動した可能性があります。
            <br />
            星の導きに従って、トップページへお戻りください。
          </p>
          <Link
            href="/"
            className="inline-block bg-gold-gradient text-bg font-semibold text-sm py-3 px-8 rounded-full shadow-gold hover:shadow-gold-hover hover:-translate-y-0.5 transition-all"
          >
            トップページへ戻る
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}


