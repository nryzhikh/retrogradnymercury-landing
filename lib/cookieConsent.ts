const STORAGE_KEY = 'mercury-cookie-consent';
const CONSENT_EVENT = 'mercury-cookie-consent-change';

// 'unknown' - начальное состояние (SSR / до чтения localStorage)
// 'pending' - прочитали, согласие не дано
// 'accepted' / 'rejected' - пользователь сделал выбор
export type ConsentStatus = 'unknown' | 'pending' | 'accepted' | 'rejected';

export function getConsentStatus(): ConsentStatus {
  if (typeof window === 'undefined') return 'unknown';

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'accepted' || stored === 'rejected') return stored;

  return 'pending';
}

export function getServerConsentStatus(): ConsentStatus {
  return 'unknown';
}

export function setConsentStatus(status: 'accepted' | 'rejected'): void {
  localStorage.setItem(STORAGE_KEY, status);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function clearConsentStatus(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

// The native 'storage' event only fires cross-tab, so we also emit a custom
// event for same-tab subscribers (e.g. useSyncExternalStore).
export function subscribeConsentStatus(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}
