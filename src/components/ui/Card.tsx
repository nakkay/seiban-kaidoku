"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "highlight" | "elevated";
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl backdrop-blur-[20px] transition-all duration-300",
          // Base styles
          "border p-7",
          // Variants
          variant === "default" && [
            "bg-card border-card-border",
            hover && "hover:border-card-border-hover",
          ],
          variant === "highlight" && [
            "bg-gradient-to-br from-[rgba(30,38,60,0.9)] to-[rgba(15,20,36,0.95)]",
            "border-[rgba(212,175,85,0.3)]",
            hover && "hover:border-[rgba(212,175,85,0.5)]",
          ],
          variant === "elevated" && [
            "bg-bg-elevated border-card-border",
            hover && "hover:border-card-border-hover",
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export { Card };


