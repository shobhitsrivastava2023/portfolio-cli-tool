// src/themes.ts
export type ThemeConfig = {
  name: string;
  fonts: {
    display: string;
    body: string;
    googleFontsUrl: string;
  };
  cssVars: Record<string, string>;
};

const accents: Record<string, Record<string, string>> = {
  cyan:    { "--accent": "#06b6d4", "--accent-glow": "rgba(6,182,212,0.3)" },
  orange:  { "--accent": "#f97316", "--accent-glow": "rgba(249,115,22,0.3)" },
  rose:    { "--accent": "#f43f5e", "--accent-glow": "rgba(244,63,94,0.3)" },
  violet:  { "--accent": "#8b5cf6", "--accent-glow": "rgba(139,92,246,0.3)" },
  emerald: { "--accent": "#10b981", "--accent-glow": "rgba(16,185,129,0.3)" },
};

export function getTheme(theme: string, accentColor: string): ThemeConfig {
  const accent = accents[accentColor] || accents["cyan"];

  const themes: Record<string, ThemeConfig> = {
    "dark-minimal": {
      name: "dark-minimal",
      fonts: {
        display: "Syne",
        body: "Manrope",
        googleFontsUrl:
          "https://fonts.googleapis.com/css2?family=Syne:wght@600;800&family=Manrope:wght@300;400;500&display=swap",
      },
      cssVars: {
        "--bg": "#0a0a0a",
        "--bg-secondary": "#111111",
        "--bg-card": "#161616",
        "--border": "rgba(255,255,255,0.06)",
        "--text-primary": "#f5f5f5",
        "--text-secondary": "#a3a3a3",
        "--text-muted": "#525252",
        "--radius": "12px",
        ...accent,
      },
    },
    "glass": {
      name: "glass",
      fonts: {
        display: "Playfair Display",
        body: "DM Sans",
        googleFontsUrl:
          "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;800&family=DM+Sans:wght@300;400;500&display=swap",
      },
      cssVars: {
        "--bg": "#0f1923",
        "--bg-secondary": "#141f2e",
        "--bg-card": "rgba(255,255,255,0.04)",
        "--border": "rgba(255,255,255,0.1)",
        "--text-primary": "#e8edf2",
        "--text-secondary": "#8899aa",
        "--text-muted": "#445566",
        "--radius": "16px",
        "--glass-blur": "12px",
        "--glass-bg": "rgba(255,255,255,0.05)",
        "--glass-border": "rgba(255,255,255,0.12)",
        ...accent,
      },
    },
  };

  return themes[theme] || themes["dark-minimal"];
}