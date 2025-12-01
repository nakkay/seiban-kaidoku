"use client";

interface BackgroundGlowProps {
  variant?: "default" | "centered";
}

export function BackgroundGlow({ variant = "default" }: BackgroundGlowProps) {
  if (variant === "centered") {
    return (
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(78, 184, 161, 0.08) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      <div
        className="absolute"
        style={{
          top: "-20%",
          left: "-10%",
          width: "50%",
          height: "60%",
          background:
            "radial-gradient(ellipse, rgba(212, 175, 85, 0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: "-10%",
          right: "-10%",
          width: "60%",
          height: "50%",
          background:
            "radial-gradient(ellipse, rgba(78, 184, 161, 0.05) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}





