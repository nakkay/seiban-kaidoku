import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-12 border-t border-divider text-center">
      <div className="container">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/legal/tokushoho" className="text-xs text-text-muted hover:text-gold transition-colors">
            特定商取引法に基づく表記
          </Link>
          <Link href="/legal/privacy" className="text-xs text-text-muted hover:text-gold transition-colors">
            プライバシーポリシー
          </Link>
          <Link href="/legal/terms" className="text-xs text-text-muted hover:text-gold transition-colors">
            利用規約
          </Link>
        </div>
        <p className="text-xs text-text-muted tracking-wider">
          © 2025 星盤解読 All rights reserved.
        </p>
      </div>
    </footer>
  );
}

