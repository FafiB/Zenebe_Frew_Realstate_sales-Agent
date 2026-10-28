/**
 * Safe localStorage access. All persistence goes through this boundary so
 * storage failures degrade gracefully instead of breaking the page.
 */

import { STORAGE_KEYS } from "./constants.js";

function readJson(key, fallback) {
  try {
    const stored = JSON.parse(localStorage.getItem(key) || "null");
    return stored ?? fallback;
  } catch (error) {
    console.error(`Could not read ${key} from this browser:`, error);
    return fallback;
  }
}

function readString(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch (error) {
    console.error(`Could not read ${key} from this browser:`, error);
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Could not save ${key} in this browser:`, error);
  }
}

export const storage = {
  readSavedHomes: () => {
    const stored = readJson(STORAGE_KEYS.SAVED_HOMES, []);
    return Array.isArray(stored) ? stored : [];
  },
  writeSavedHomes: (ids) => write(STORAGE_KEYS.SAVED_HOMES, JSON.stringify(ids)),

  readLanguage: () => (readString(STORAGE_KEYS.LANGUAGE, "en") === "am" ? "am" : "en"),
  writeLanguage: (language) => write(STORAGE_KEYS.LANGUAGE, language),

  readTheme: () => (readString(STORAGE_KEYS.THEME, "dark") === "light" ? "light" : "dark"),
  writeTheme: (theme) => write(STORAGE_KEYS.THEME, theme),
};
