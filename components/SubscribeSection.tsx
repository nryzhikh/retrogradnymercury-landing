"use client";

import { useRef, useState } from "react";
import styles from "./SubscribeSection.module.css";

// TODO: replace with the real Google Form `formResponse` URL.
// Open the form → preview → submit test entry → copy the URL ending in `/formResponse`.
const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSekpsScE5_ubvO7RE-STT5OlpCo0XMW9AwYkwSush_-VZ-H0Q/formResponse";


// TODO: replace with the `entry.<id>` name of the email field on that form.
// Inspect the email input in the form preview, or use "Get pre-filled link".
const EMAIL_ENTRY_NAME = "entry.1827305086";

const IFRAME_NAME = "hidden_subscribe_iframe";

export function SubscribeSection() {
  const formRef = useRef<HTMLFormElement>(null);
  // True only between a user submit and the iframe load that follows it.
  // Avoids brittle "skip the first load" logic that races with React mounting
  // and Strict Mode double-invocation.
  const pendingSubmitRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    pendingSubmitRef.current = true;
    setIsSubmitting(true);
    setIsSuccess(false);
  };

  const handleIframeLoad = () => {
    if (!pendingSubmitRef.current) {
      return;
    }
    pendingSubmitRef.current = false;
    formRef.current?.reset();
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <section
      aria-labelledby="subscribe-heading"
      className={styles.subscribe}
    >
      <h2 id="subscribe-heading" className={styles.heading}>
        Узнавайте первыми о наших событиях
      </h2>

      <form
        ref={formRef}
        className={styles.form}
        action={GOOGLE_FORM_ACTION}
        method="POST"
        target={IFRAME_NAME}
        onSubmit={handleSubmit}
        noValidate={false}
      >
        <label htmlFor="subscribe-email" className={styles.label}>
          Ваш e-mail
        </label>
        <input
          id="subscribe-email"
          name={EMAIL_ENTRY_NAME}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="example@host.com"
          className={styles.input}
          required
        />

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
            <p className={styles.successMessage}>
              Спасибо! Вы подписаны.
            </p>
          ) : null}
        </div>
      </form>

      <iframe
        name={IFRAME_NAME}
        title="Google Form subscribe target"
        className={styles.hiddenIframe}
        onLoad={handleIframeLoad}
      />
    </section>
  );
}
