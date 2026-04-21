/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "16px",
      },
      screens: {
        "2xl": "1400px",
        "3xl": "1600px",
        medium: "978px",
      },
      translate: {
        center: "translate(-50%, -50%)",
      },
      backgroundImage: {
        "main-gradient":
          "radial-gradient(114.29% 42.52% at 103.66% 58.94%, #D0F8F1 0%, #D1F3FF 18.23%, #ECF8FF 51.28%, #E1FFFA 80.21%, #D0F2FF 93.23%)",
        "cover-gradient":
          "linear-gradient(84deg, #FFF -1.95%, #C2E8F5 59.98%, #FFF 100.64%)",
        "cover-gradient-dark":
          "linear-gradient(179deg, #29ACCE -202.54%, rgba(0, 0, 0, 0.00) 192.47%)",
        "classic-gradient":
          "radial-gradient(325.52% 79.63% at 100% -0.02%, #FFF 0%, rgba(255, 255, 255, 0.00) 100%), radial-gradient(205.45% 61.89% at 2.34% 99.98%, #FFF 0%, rgba(255, 255, 255, 0.00) 100%)",
        "project-page-gradient":
          "linear-gradient(180deg, #C2E8F5 -17.44%, #FFF 17.72%)",
        "research-card-gradient": "var(--gradient-research-card)",
        "page-header-gradient":
          "linear-gradient(180deg, #C2E8F5 -17.44%, #FFF 62.5%)",
        "transparent-gradient":
          "linear-gradient(180deg, #000000 0%, #000000 100%)",
      },
      colors: {
        corduroy: "#4A5754",
        orange: "#E1523A",
        orangeDark: "#E3533A",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        black: "#01030A",
        anakiwa: {
          default: "#D0F2FF",
          50: "#F2FAFD",
          100: "#E4F3FA",
          200: "#C2E8F5",
          300: "#A3DFF0",
          400: "#50C3E0",
          500: "#29ACCE",
          600: "#1A8BAF",
          700: "#166F8E",
          900: "#184F62",
          800: "#175E75",
          950: "#103241",
          975: "#081519",
        },
        tuatara: {
          100: "#E5E6E8",
          200: "#CDCFD4",
          300: "#AAADB6",
          400: "#808590",
          500: "#656A75",
          600: "#565964",
          700: "#4A4C54",
          800: "#414349",
          950: "#242528",
        },
        skeleton: {
          DEFAULT: "var(--skeleton-background)",
        },

        background: "var(--background)",
        foreground: "var(--foreground)",
        active: {
          selection: "var(--active-selection)",
        },
        primary: {
          DEFAULT: "var(--text-primary)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "var(--text-secondary)",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "overlay-show": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        "content-show": {
          from: { opacity: 0, transform: "translate(-50%, -48%) scale(0.96)" },
          to: { opacity: 1, transform: "translate(-50%, -50%) scale(1)" },
        },
        "slide-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "slide-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "overlay-show": "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "content-show": "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down": "slide-down 0.2s ease-out",
        "slide-up": "slide-up 0.2s ease-out",
      },
    },
  },
  // eslint-disable-next-line no-undef, @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
}
