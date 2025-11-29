"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "gold", size = "md", children, disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-300",
          "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-bg",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          // Variants
          variant === "gold" && [
            "bg-gold-gradient text-bg",
            "shadow-gold hover:shadow-gold-hover hover:-translate-y-0.5",
            "tracking-wider",
          ],
          variant === "outline" && [
            "border border-accent text-accent bg-transparent",
            "hover:bg-accent-subtle",
          ],
          variant === "ghost" && [
            "text-text-muted bg-transparent",
            "hover:text-text hover:bg-white/5",
          ],
          // Sizes
          size === "sm" && "text-sm py-2 px-4 rounded-full",
          size === "md" && "text-base py-3.5 px-12 rounded-full",
          size === "lg" && "text-md py-4 px-14 rounded-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

// Link button variant
export interface LinkButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant = "gold", size = "md", children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-300 cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-gold/50",
          // Variants
          variant === "gold" && [
            "bg-gold-gradient text-bg",
            "shadow-gold hover:shadow-gold-hover hover:-translate-y-0.5",
            "tracking-wider",
          ],
          variant === "outline" && [
            "border border-accent text-accent bg-transparent",
            "hover:bg-accent-subtle",
          ],
          variant === "ghost" && [
            "text-text-muted bg-transparent",
            "hover:text-text",
          ],
          // Sizes
          size === "sm" && "text-sm py-2.5 px-6 rounded-full gap-2",
          size === "md" && "text-base py-3.5 px-12 rounded-full",
          size === "lg" && "text-md py-4 px-14 rounded-full",
          className
        )}
        {...props}
      >
        {children}
      </a>
    );
  }
);

LinkButton.displayName = "LinkButton";

export { Button, LinkButton };




