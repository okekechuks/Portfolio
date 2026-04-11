import type { StorageKey } from "@/types";

const isBrowser = typeof window !== "undefined";

export function getFromStorage<T>(key: StorageKey, fallback: T): T {
  if (!isBrowser) return fallback;

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setInStorage<T>(key: StorageKey, value: T): void {
  if (!isBrowser) return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent(`storage:${key}`, { detail: value }));
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
}

export function removeFromStorage(key: StorageKey): void {
  if (!isBrowser) return;
  localStorage.removeItem(key);
}

export function subscribeToStorage<T>(
  key: StorageKey,
  callback: (value: T) => void
): () => void {
  if (!isBrowser) return () => undefined;

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<T>;
    callback(customEvent.detail);
  };

  window.addEventListener(`storage:${key}`, handler);

  const storageHandler = (event: StorageEvent) => {
    if (event.key === key && event.newValue) {
      try {
        callback(JSON.parse(event.newValue) as T);
      } catch {
        /* ignore */
      }
    }
  };

  window.addEventListener("storage", storageHandler);

  return () => {
    window.removeEventListener(`storage:${key}`, handler);
    window.removeEventListener("storage", storageHandler);
  };
}
