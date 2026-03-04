// src/themes.ts
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
        "--bg": "#0f0f0f",
        "--bg-secondary": "#161616",
        "--bg-card": "#1a1a1a",
        "--border": "#2a2a2a",
        "--text-primary": "#ededed",
        "--text-secondary": "#888888",
        "--text-muted": "#444444",
        "--accent": "#ededed",
        "--accent-fg": "#0f0f0f",
        "--radius": "12px",
        "--font-display": "'Fraunces', serif",
        "--font-body": "'DM Sans', sans-serif",
        "--nav-bg": "rgba(20,20,20,0.75)",
        "--nav-shadow": "rgba(0,0,0,0.4)",
      },
    },
  };

  return themes[theme] || themes["dark"];
}
