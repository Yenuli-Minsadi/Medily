/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // or 'media' if you prefer system preference
  theme: {
    extend: {
      // ────────────────────────────────────────
      // Colors – Medily healthcare palette
      // ────────────────────────────────────────
      colors: {
        // Core brand colors
        "medily-navy": {
          DEFAULT: "#0f172a",
          900: "#0b1324",
          800: "#1e293b",
        },
        "medily-purple": {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        "medily-blue": {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        "medily-soft-blue": "#c9e6f0", // your requested light blue
        "medily-soft-purple": "#d8b4fe", // soft lavender
        "medily-periwinkle": "#a8b3cf",
        "medily-gray": {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },

      // ────────────────────────────────────────
      // Typography & spacing improvements
      // ────────────────────────────────────────
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        heading: ["Inter", "sans-serif"],
      },

      fontSize: {
        "2xs": "0.625rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
      },

      lineHeight: {
        tight: "1.1",
        snug: "1.25",
        relaxed: "1.625",
      },

      // ────────────────────────────────────────
      // Border radius & shadows for modern glass/neumorphic feel
      // ────────────────────────────────────────
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0, 0, 0, 0.06)",
        card: "0 10px 30px rgba(15, 23, 42, 0.08)",
        glass: "0 8px 32px rgba(31, 38, 135, 0.15)",
        "glow-purple": "0 0 20px rgba(200, 132, 252, 0.25)",
        "glow-blue": "0 0 20px rgba(201, 230, 240, 0.3)",
      },

      // ────────────────────────────────────────
      // Animations & transitions
      // ────────────────────────────────────────
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
      },

      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },

      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "pulse-soft": "pulse-soft 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },

      // ────────────────────────────────────────
      // Useful spacing & z-index helpers
      // ────────────────────────────────────────
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },

      zIndex: {
        60: "60",
        70: "70",
        100: "100",
      },
    },
  },
  plugins: [
    // Optional: add these popular plugins if you install them
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
    // require('@tailwindcss/aspect-ratio'),
  ],
};
