'use client';

import { useCookieConsent } from '@/hooks/useCookieConsent';
import styles from './CookieBanner.module.css';

export default function CookieBanner() {
  const { consentStatus, acceptAll, rejectAll } = useCookieConsent();

  // Показываем баннер ТОЛЬКО когда статус 'pending'
  // 'unknown' - ещё не прочитали из localStorage (скрыто, без мерцания)
  // 'accepted'/'rejected' - пользователь уже сделал выбор (скрыто)
  if (consentStatus !== 'pending') {
    return null;
  }

  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h3 className={styles.title}>Мы используем cookie</h3>
          <p className={styles.description}>
            Для улучшения работы сайта мы используем аналитические cookie. Вы можете принять или
            отклонить их использование.
          </p>
          <a
            href="https://docs.google.com/document/d/1AGLc2Liem0PR6PenVA2jwC-SHSXZX-fCkYu4mtbktW0/edit?tab=t.0"
            className={styles.link}
            target="_blank"
            rel="noreferrer"
          >
            Политика конфиденциальности
          </a>
        </div>
        <div className={styles.buttons}>
          <button
            onClick={acceptAll}
            className={styles.accept}
            type="button"
            aria-label="Принять все cookie"
          >
            Принять всё
          </button>
          <button
            onClick={rejectAll}
            className={styles.reject}
            type="button"
            aria-label="Отклонить все cookie"
          >
            Отклонить
          </button>
        </div>
      </div>
    </div>
  );
}
