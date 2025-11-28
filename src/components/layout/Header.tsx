"use client";

import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

interface HeaderProps {
  showCta?: boolean;
  ctaText?: string;
  ctaHref?: string;
  rightElement?: React.ReactNode;
  badge?: string;
}

export function Header({
  showCta = true,
  ctaText = "無料で占う",
  ctaHref = "#form",
  rightElement,
  badge,
}: HeaderProps) {
  return (
    <header className="py-5 border-b border-divider relative z-50">
      <div className="container">
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

          {/* Right side */}
          <div className="flex items-center gap-4">
            {badge && (
              <span className="bg-gold-gradient text-bg text-xs font-semibold py-1 px-3 rounded-full tracking-wider">
                {badge}
              </span>
            )}
            {rightElement}
            {showCta && !rightElement && (
              <LinkButton href={ctaHref} size="sm">
                {ctaText}
              </LinkButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

