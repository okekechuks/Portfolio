import { create } from "zustand";
import { settingsService } from "@/services/settingsService";
import { defaultSiteSettings } from "@/data/defaults";
import type { SiteSettings } from "@/types";

interface ThemeState {
  darkMode: boolean;
  accentColor: string;
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  setDarkMode: (darkMode: boolean) => Promise<void>;
  setAccentColor: (color: string) => Promise<void>;
  applyTheme: (settings: SiteSettings) => void;
}

const THEME_STORAGE_KEY = "portfolio_theme_preferences";

function applyThemeToDOM(darkMode: boolean, accentColor: string) {
  if (typeof document === "undefined") return;

  document.documentElement.classList.toggle("dark", darkMode);
  document.documentElement.style.setProperty("--accent", accentColor);
}

function persistTheme(darkMode: boolean, accentColor: string) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    THEME_STORAGE_KEY,
    JSON.stringify({ darkMode, accentColor })
  );
}

function clearStoredTheme() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(THEME_STORAGE_KEY);
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  darkMode: defaultSiteSettings.darkMode,
  accentColor: defaultSiteSettings.accentColor,
  isHydrated: false,

  hydrate: async () => {
    let settings = defaultSiteSettings;

    try {
      settings = await settingsService.getSettings();
    } catch {
      settings = defaultSiteSettings;
    }

    const darkMode = settings.darkMode;
    const accentColor = settings.accentColor;

    applyThemeToDOM(darkMode, accentColor);
    clearStoredTheme();
    set({
      darkMode,
      accentColor,
      isHydrated: true,
    });
  },

  setDarkMode: async (darkMode: boolean) => {
    const accentColor = get().accentColor;
    persistTheme(darkMode, accentColor);
    applyThemeToDOM(darkMode, accentColor);
    set({ darkMode });
  },

  setAccentColor: async (accentColor: string) => {
    const darkMode = get().darkMode;
    persistTheme(darkMode, accentColor);
    applyThemeToDOM(darkMode, accentColor);
    set({ accentColor });
  },

  applyTheme: (settings: SiteSettings) => {
    applyThemeToDOM(settings.darkMode, settings.accentColor);
    clearStoredTheme();
    set({
      darkMode: settings.darkMode,
      accentColor: settings.accentColor,
    });
  },
}));
