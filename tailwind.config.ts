import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SparkOn-inspired industrial dark palette
        ink: {
          950: "#0A0A0A",
          900: "#111418",
          850: "#13171C",
          800: "#161A1F",
          700: "#1B2026",
          600: "#262A30",
          500: "#3A4049",
        },
        electric: {
          DEFAULT: "#00E0FF",
          50: "#E5FBFF",
          100: "#B8F4FF",
          300: "#5EE9FF",
          500: "#00E0FF",
          600: "#00B8D4",
          700: "#0093A8",
        },
        kfupm: {
          green: "#006A4E",
          glow: "#00B47C",
        },
        spark: {
          orange: "#FF7A00",
          amber: "#FFB347",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#B8BFC7",
          tertiary: "#7A828D",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Space Mono", "monospace"],
      },
      backgroundImage: {
        "grid-electric":
          "linear-gradient(rgba(0,224,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,224,255,0.07) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(0,224,255,0.15) 0%, transparent 60%)",
        "spark-gradient":
          "linear-gradient(135deg, #00E0FF 0%, #00B47C 100%)",
      },
      boxShadow: {
        "glow-electric": "0 0 24px rgba(0, 224, 255, 0.35)",
        "glow-soft": "0 0 60px rgba(0, 224, 255, 0.18)",
        "glow-amber": "0 0 24px rgba(255, 122, 0, 0.45)",
        "glow-green": "0 0 24px rgba(0, 180, 124, 0.45)",
        "card": "0 4px 20px rgba(0, 0, 0, 0.45)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        "slow-spin": "spin 12s linear infinite",
        "current-flow": "current-flow 3s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 6px rgba(0,224,255,0.6))" },
          "50%": { opacity: "0.6", filter: "drop-shadow(0 0 12px rgba(0,224,255,0.9))" },
        },
        "current-flow": {
          "0%": { strokeDashoffset: "40" },
          "100%": { strokeDashoffset: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
