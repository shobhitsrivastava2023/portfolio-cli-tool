export type ThemeConfig = {
  name: "light" | "dark";
  fonts: {
    googleFontsUrl: string;
  };
  cssVars: Record<string, string>;
};

export function getTheme(theme: string): ThemeConfig {
  const themes: Record<string, ThemeConfig> = {
    light: {
      name: "light",
      fonts: {
        googleFontsUrl:
          "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,800;1,600&family=DM+Sans:wght@300;400;500&display=swap",
      },
      cssVars: {
        "--bg": "#ffffff",
        "--bg-secondary": "#f7f7f5",
        "--bg-card": "#ffffff",
        "--border": "#e8e8e4",
        "--text-primary": "#111111",
        "--text-secondary": "#555555",
        "--text-muted": "#999999",
        "--accent": "#111111",
        "--accent-fg": "#ffffff",
        "--tag-bg": "rgba(0,0,0,0.04)",
        "--tag-border": "rgba(0,0,0,0.08)",
        "--tag-text": "#444444",
        "--available-bg": "rgba(22,163,74,0.08)",
        "--available-border": "rgba(22,163,74,0.2)",
        "--available-text": "#16a34a",
        "--social-bg": "rgba(0,0,0,0.02)",
        "--social-hover-bg": "rgba(0,0,0,0.06)",
        "--social-border": "#e8e8e4",
        "--radius": "12px",
        "--font-display": "'Fraunces', serif",
        "--font-body": "'DM Sans', sans-serif",
        "--nav-bg": "rgba(255,255,255,0.75)",
        "--nav-shadow": "rgba(0,0,0,0.08)",
      },
    },
    dark: {
      name: "dark",
      fonts: {
        googleFontsUrl:
          "https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;0,800;1,600&family=DM+Sans:wght@300;400;500&display=swap",
      },
      cssVars: {
        "--bg": "#0c0c0c",
        "--bg-secondary": "#141414",
        "--bg-card": "#181818",
        "--border": "#272727",
        "--text-primary": "#f0f0f0",
        "--text-secondary": "#a8a8a8",
        "--text-muted": "#606060",
        "--accent": "#f0f0f0",
        "--accent-fg": "#0c0c0c",
        "--tag-bg": "rgba(255,255,255,0.05)",
        "--tag-border": "rgba(255,255,255,0.1)",
        "--tag-text": "#c8c8c8",
        "--available-bg": "rgba(74,222,128,0.08)",
        "--available-border": "rgba(74,222,128,0.2)",
        "--available-text": "#4ade80",
        "--social-bg": "rgba(255,255,255,0.04)",
        "--social-hover-bg": "rgba(255,255,255,0.08)",
        "--social-border": "#272727",
        "--radius": "12px",
        "--font-display": "'Fraunces', serif",
        "--font-body": "'DM Sans', sans-serif",
        "--nav-bg": "rgba(18,18,18,0.85)",
        "--nav-shadow": "rgba(0,0,0,0.5)",
      },
    },
  };  // ← this was missing

  return themes[theme] || themes["dark"];
}