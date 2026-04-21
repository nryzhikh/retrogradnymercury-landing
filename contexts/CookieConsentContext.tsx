'use client';

import { createContext, useCallback, useMemo, useSyncExternalStore, type ReactNode } from 'react';
import {
  getConsentStatus,
  getServerConsentStatus,
  setConsentStatus,
  clearConsentStatus,
  subscribeConsentStatus,
  type ConsentStatus,
} from '@/lib/cookieConsent';

interface CookieConsentContextValue {
  consentStatus: ConsentStatus;
  acceptAll: () => void;
  rejectAll: () => void;
  resetConsent: () => void;
}

export const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined);

interface CookieConsentProviderProps {
  children: ReactNode;
}

export function CookieConsentProvider({ children }: CookieConsentProviderProps) {
  // useSyncExternalStore подписывается на localStorage без cascading renders,
  // корректно отрабатывает SSR и синхронизирует состояние между вкладками.
  const consentStatus = useSyncExternalStore(
    subscribeConsentStatus,
    getConsentStatus,
    getServerConsentStatus,
  );

  const acceptAll = useCallback(() => {
    setConsentStatus('accepted');
  }, []);

  const rejectAll = useCallback(() => {
    setConsentStatus('rejected');
  }, []);

  const resetConsent = useCallback(() => {
    clearConsentStatus();
  }, []);

  const value = useMemo(
    () => ({
      consentStatus,
      acceptAll,
      rejectAll,
      resetConsent,
    }),
    [consentStatus, acceptAll, rejectAll, resetConsent],
  );

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>;
}
