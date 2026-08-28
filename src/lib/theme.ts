export type Theme = "light" | "dark";

const STORAGE_KEY = "link42-theme";

export const readTheme = (): Theme => {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
};

export const applyTheme = (theme: Theme): Theme => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEY, theme);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#111110" : "#ffffff");
  return theme;
};

export const oppositeTheme = (theme: Theme): Theme => (theme === "dark" ? "light" : "dark");
