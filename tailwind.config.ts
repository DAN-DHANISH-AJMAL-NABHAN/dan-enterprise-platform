import type { Config } from "tailwindcss";

// rgb(var(--x) / <alpha-value>) is the Tailwind v3 pattern that makes
// opacity modifiers (e.g. bg-primary/10) work with CSS-variable colors.
// It requires the variable to hold space-separated "R G B" channels,
// which is how they're defined in src/styles/globals.css.
const withOpacity = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: withOpacity("--color-background"),
        foreground: withOpacity("--color-foreground"),
        primary: {
          DEFAULT: withOpacity("--color-primary"),
          foreground: withOpacity("--color-primary-foreground"),
        },
        secondary: {
          DEFAULT: withOpacity("--color-secondary"),
          foreground: withOpacity("--color-secondary-foreground"),
        },
        border: withOpacity("--color-border"),
        panel: withOpacity("--color-panel"),
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        card: "1rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
