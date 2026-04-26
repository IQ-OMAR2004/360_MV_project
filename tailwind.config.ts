import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sparkon KFUPM official palette
        sparkon: {
          red: "#EB1B26",
          "red-dark": "#C41520",
          "red-dim": "rgba(235,27,38,0.15)",
        },
        ink: {
          950: "#000000",
          900: "#0D1117",
          850: "#111418",
          800: "#161A1F",
          700: "#1B2026",
          600: "#262A30",
          500: "#3A4049",
        },
        // Keep electric alias pointing to Sparkon Red so existing refs auto-update
        electric: {
          DEFAULT: "#EB1B26",
          50: "#FEECEC",
          100: "#FCDCDC",
          300: "#F58085",
          500: "#EB1B26",
          600: "#C41520",
          700: "#9C1018",
        },
        kfupm: {
          green: "#4BA181",  // teal/mint from style guide (Weglot accent)
          glow: "#4BA181",
        },
        spark: {
          orange: "#EB1B26",  // re-map to Sparkon red for consistency
          amber: "#FF5A5F",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "rgba(255,255,255,0.75)",
          tertiary: "rgba(255,255,255,0.45)",
        },
      },
      fontFamily: {
        // DM Sans = closest free alternative to Helvetica Neue display weight
        sans: ["DM Sans", "Inter", "Arial", "Helvetica", "sans-serif"],
        display: ["DM Sans", "Arial", "Helvetica", "sans-serif"],
        mono: ["JetBrains Mono", "IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        "spark-gradient": "linear-gradient(135deg, #EB1B26 0%, #C41520 100%)",
        "red-glow":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(235,27,38,0.22) 0%, transparent 60%)",
        "grid-dark":
          "linear-gradient(rgba(235,27,38,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(235,27,38,0.07) 1px, transparent 1px)",
      },
      boxShadow: {
        "glow-red": "0 0 24px rgba(235, 27, 38, 0.50)",
        "glow-soft": "0 0 60px rgba(235, 27, 38, 0.20)",
        "glow-electric": "0 0 24px rgba(235, 27, 38, 0.50)",
        "glow-amber": "0 0 24px rgba(235, 27, 38, 0.45)",
        "glow-green": "0 0 24px rgba(75, 161, 129, 0.40)",
        card: "0 4px 24px rgba(0, 0, 0, 0.60)",
      },
      animation: {
        "pulse-red": "pulse-red 2.4s ease-in-out infinite",
        "current-flow": "current-flow 3s linear infinite",
      },
      keyframes: {
        "pulse-red": {
          "0%, 100%": { opacity: "1", filter: "drop-shadow(0 0 6px rgba(235,27,38,0.7))" },
          "50%": { opacity: "0.65", filter: "drop-shadow(0 0 14px rgba(235,27,38,1))" },
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
