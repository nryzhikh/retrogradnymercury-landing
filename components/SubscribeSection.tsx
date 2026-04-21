"use client";

import { useRef, useState, type FormEvent } from "react";
import styles from "./SubscribeSection.module.css";

export function SubscribeSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const email = fd.get("email");
    const consent_ads = fd.get("consent_ads") === "on";

    setSubmitError(null);
    setIsSuccess(false);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent_ads }),
      });
      if (!res.ok) {
        throw new Error(`status_${res.status}`);
      }
      form.reset();
      setIsSuccess(true);
    } catch (err) {
      console.error("subscribe failed", err);
      setSubmitError(
        "Не удалось оформить подписку. Проверьте адрес и попробуйте ещё раз.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="subscribe-heading" className={styles.subscribe}>
      <h2 id="subscribe-heading" className={styles.heading}>
        Узнавайте первыми о наших событиях
      </h2>

      <form
        ref={formRef}
        className={styles.form}
        onSubmit={handleSubmit}
        noValidate={false}
      >
        <label htmlFor="subscribe-email" className={styles.label}>
          Ваш e-mail
        </label>
        <input
          id="subscribe-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="example@host.com"
          className={styles.input}
          required
        />

        <div className={styles.consentRow}>
          <input
            id="lead-consent_ads"
            name="consent_ads"
            type="checkbox"
            className={styles.consentCheckbox}
            title="Пожалуйста, подтвердите согласие на обработку персональных данных."
            // onInvalid={handleConsentInvalid}
            // onChange={clearValidity}
            required
          />
          <label htmlFor="lead-consent-data" className={styles.consentLabel}>
            Я согласен(а) на{" "}
            <a
              href="https://disk.yandex.ru/i/Cf9Huz2bIyPUqg"
              target="_blank"
              rel="noopener noreferrer"
            >
            получение рекламной рассылки
            </a>
          </label>
        </div>

        <button
          type="submit"
          className={styles.submit}
          disabled={isSubmitting}
          aria-label="Подписаться"
        >
          <img
            src="/images/подписаться-глб 1.png"
            alt=""
            aria-hidden="true"
            className={styles.submitImage}
          />
        </button>

        <div className={styles.messageSlot} aria-live="polite" role="status">
          {isSuccess ? (
            <p className={styles.successMessage}>Спасибо! Вы подписаны.</p>
          ) : null}
          {submitError ? (
            <p className={styles.errorMessage} role="alert">
              {submitError}
            </p>
          ) : null}
        </div>

      </form>
    </section>
  );
}
