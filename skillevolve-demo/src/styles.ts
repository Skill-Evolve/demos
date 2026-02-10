import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrains } from "@remotion/google-fonts/JetBrainsMono";

const { fontFamily: interFamily } = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

const { fontFamily: monoFamily } = loadJetBrains("normal", {
  weights: ["400", "500", "700"],
  subsets: ["latin"],
});

export const FONTS = {
  heading: interFamily,
  body: interFamily,
  mono: monoFamily,
};

// Rich dark theme — colorful but comfortable
export const COLORS = {
  // Backgrounds — deep navy/slate, not pure black
  bg: "#0B0F1A",
  bgGrad1: "#0E1225",
  bgGrad2: "#131830",
  bgCard: "#151A2E",
  bgCardBorder: "#1E2545",

  // Primary accent — warm indigo-violet
  accent: "#7C6AFF",
  accentLight: "#A594FF",
  accentSoft: "rgba(124, 106, 255, 0.15)",
  accentGlow: "rgba(124, 106, 255, 0.12)",

  // Feature colors — saturated but not neon
  blue: "#4A9EFF",
  green: "#36D399",
  orange: "#FFAD4A",
  pink: "#FF6B8A",
  cyan: "#4AD8E0",
  purple: "#B07AFF",

  // Typography — high contrast on dark
  white: "#EEEEF2",
  text: "#C8CAD4",        // body text — clearly readable
  textSecondary: "#8B90A5", // labels, secondary
  textMuted: "#5A5F78",    // very subtle
  border: "#252B45",       // card borders
};
