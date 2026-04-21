'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCookieConsent } from '../hooks/useCookieConsent';
import { trackPageView } from '../lib/yandexMetrika';

const YANDEX_METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || '99918727';

export default function YandexMetrika() {
  const { consentStatus } = useCookieConsent();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Отслеживание изменений страницы (SPA навигация)
  useEffect(() => {
    if (consentStatus === 'accepted') {
      const url = pathname + (searchParams ? `?${searchParams.toString()}` : '');
      trackPageView(YANDEX_METRIKA_ID, url);
    }
  }, [pathname, searchParams, consentStatus]);

  // Не загружать скрипт если не принято согласие
  if (consentStatus !== 'accepted') {
    return null;
  }

  return (
    <Script
      id="yandex-metrika"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${YANDEX_METRIKA_ID}, "init", {
            webvisor: true,
            clickmap: true,
            accurateTrackBounce: true,
            trackLinks: true
          });
        `,
      }}
    />
  );
}
