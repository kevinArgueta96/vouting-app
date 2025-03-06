import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      letterSpacing: {
        'super-tight': '-0.03em', // Reduced from -0.15em for better readability
      },
      lineHeight: {
        'custom-35': '35px',
        'custom-34': '34px',
        'custom-17': '17px',
      },
      colors: {
        vouting: {
          blue: "#334798", // Medium-dark blue color
          pink: "#FFD4D4" // Light pink color for illustrations
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
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
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "cascade-fall": {
          "0%": { 
            opacity: "0",
            transform: "translate(-50%, -300%) scale(var(--scale, 1))"
          },
          "40%": {
            opacity: "1",
            transform: "translate(-50%, -150%) scale(var(--scale, 1))"
          },
          "70%": {
            transform: "translate(-50%, -30%) scale(var(--scale, 1))"
          },
          "85%": {
            transform: "translate(-50%, -60%) scale(var(--scale, 1))"
          },
          "100%": { 
            transform: "translate(-50%, -50%) scale(var(--scale, 1))"
          }
        },
        "float-1": {
          "0%": { transform: "translate(-50%, -50%) scale(var(--scale, 1))" },
          "50%": { transform: "translate(-50%, -55%) scale(var(--scale, 1))" },
          "100%": { transform: "translate(-50%, -50%) scale(var(--scale, 1))" }
        },
        "float-2": {
          "0%": { transform: "translate(-50%, -50%) scale(var(--scale, 1))" },
          "50%": { transform: "translate(-52%, -53%) scale(var(--scale, 1))" },
          "100%": { transform: "translate(-50%, -50%) scale(var(--scale, 1))" }
        },
        "float-3": {
          "0%": { transform: "translate(-50%, -50%) scale(var(--scale, 1))" },
          "50%": { transform: "translate(-48%, -54%) scale(var(--scale, 1))" },
          "100%": { transform: "translate(-50%, -50%) scale(var(--scale, 1))" }
        },
        "float-4": {
          "0%": { transform: "translate(-50%, -50%) scale(var(--scale, 1))" },
          "50%": { transform: "translate(-51%, -52%) scale(var(--scale, 1))" },
          "100%": { transform: "translate(-50%, -50%) scale(var(--scale, 1))" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "cascade-fall": "cascade-fall 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
        "float-1": "float-1 3s ease-in-out infinite 0.8s",
        "float-2": "float-2 3.2s ease-in-out infinite 0.8s",
        "float-3": "float-3 3.4s ease-in-out infinite 0.8s",
        "float-4": "float-4 3.6s ease-in-out infinite 0.8s"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
