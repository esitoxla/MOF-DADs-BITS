const LEGACY_KEY = "bits-theme";

function storageKey(userId) {
  return `${LEGACY_KEY}:${userId}`;
}

export function readUserTheme(userId) {
  if (userId == null || userId === "") return "light";
  try {
    return localStorage.getItem(storageKey(userId)) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function writeUserTheme(userId, theme) {
  if (userId == null || userId === "") return;
  const value = theme === "dark" ? "dark" : "light";
  try {
    localStorage.setItem(storageKey(userId), value);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // Preference is optional if storage is blocked.
  }
}

export function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

try {
  localStorage.removeItem(LEGACY_KEY);
} catch {
  // Ignore storage access errors during startup.
}
