import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 背景色
        bg: {
          DEFAULT: "#0a0e1a",
          elevated: "#0f1424",
        },
        // アクセントカラー
        accent: {
          DEFAULT: "#4eb8a1",
          subtle: "rgba(78, 184, 161, 0.12)",
        },
        // ゴールド
        gold: {
          DEFAULT: "#d4af55",
          light: "#e8c878",
          subtle: "rgba(212, 175, 85, 0.1)",
        },
        // テキスト
        text: {
          DEFAULT: "#f8f6f1",
          muted: "rgba(248, 246, 241, 0.55)",
        },
        // ボーダー・区切り
        divider: "rgba(212, 175, 85, 0.12)",
        card: {
          border: "rgba(212, 175, 85, 0.15)",
          "border-hover": "rgba(212, 175, 85, 0.35)",
        },
      },
      fontFamily: {
        base: ['"Zen Kaku Gothic Antique"', "sans-serif"],
        serif: ['"Zen Antique"', "serif"],
      },
      fontSize: {
        xs: ["0.64rem", { lineHeight: "1.5" }],      // 10.24px
        sm: ["0.8rem", { lineHeight: "1.6" }],       // 12.8px
        base: ["1rem", { lineHeight: "1.8" }],       // 16px
        md: ["1.25rem", { lineHeight: "1.6" }],      // 20px
        lg: ["1.563rem", { lineHeight: "1.5" }],     // 25px
        xl: ["1.953rem", { lineHeight: "1.4" }],     // 31.25px
        "2xl": ["2.441rem", { lineHeight: "1.3" }],  // 39px
      },
      borderRadius: {
        md: "12px",
        lg: "20px",
        xl: "24px",
        full: "999px",
      },
      backgroundImage: {
        card: "linear-gradient(145deg, rgba(20, 28, 50, 0.9) 0%, rgba(12, 16, 30, 0.95) 100%)",
        "gold-gradient": "linear-gradient(135deg, #d4af55 0%, #e8c878 100%)",
      },
      boxShadow: {
        gold: "0 4px 30px rgba(212, 175, 85, 0.25)",
        "gold-hover": "0 8px 40px rgba(212, 175, 85, 0.35)",
        glow: "0 0 30px rgba(212, 175, 85, 0.6)",
      },
      animation: {
        twinkle: "twinkle 4s infinite ease-in-out",
        "rotate-slow": "rotate-slow 60s linear infinite",
        "pulse-glow": "pulse-glow 4s infinite ease-in-out",
        "dot-bounce": "dot-bounce 1.4s infinite ease-in-out",
        shoot: "shoot 4s infinite",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.7" },
        },
        "rotate-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5", transform: "translate(-50%, -50%) scale(1)" },
          "50%": { opacity: "1", transform: "translate(-50%, -50%) scale(1.1)" },
        },
        "dot-bounce": {
          "0%, 80%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "40%": { opacity: "1", transform: "scale(1.2)" },
        },
        shoot: {
          "0%": { opacity: "0", transform: "translateX(0) translateY(0) rotate(-35deg)" },
          "5%": { opacity: "1" },
          "15%": { opacity: "0", transform: "translateX(200px) translateY(100px) rotate(-35deg)" },
          "100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
