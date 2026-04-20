"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "./FormSection.module.css";

export function FormSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const hasLoadedIframeRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isSuccess && !dialog.open) {
      dialog.showModal();
    } else if (!isSuccess && dialog.open) {
      dialog.close();
    }
  }, [isSuccess]);

  const closeSuccessDialog = () => {
    setIsSuccess(false);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setIsSuccess(false);
  };

  const handleIframeLoad = () => {
    // Ignore first load event from the initial empty iframe render.
    if (!hasLoadedIframeRef.current) {
      hasLoadedIframeRef.current = true;
      return;
    }

    if (!isSubmitting) {
      return;
    }

    formRef.current?.reset();
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  type FieldMessages = {
    valueMissing?: string;
    typeMismatch?: string;
    patternMismatch?: string;
    tooShort?: string;
    tooLong?: string;
  };

  const pickValidationMessage = (
    validity: ValidityState,
    messages: FieldMessages,
  ): string => {
    if (validity.valueMissing && messages.valueMissing) {
      return messages.valueMissing;
    }
    if (validity.typeMismatch && messages.typeMismatch) {
      return messages.typeMismatch;
    }
    if (validity.patternMismatch && messages.patternMismatch) {
      return messages.patternMismatch;
    }
    if (validity.tooShort && messages.tooShort) {
      return messages.tooShort;
    }
    if (validity.tooLong && messages.tooLong) {
      return messages.tooLong;
    }
    return "";
  };

  const makeInvalidHandler =
    (messages: FieldMessages) =>
    (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const input = event.currentTarget;
      input.setCustomValidity(pickValidationMessage(input.validity, messages));
    };

  const clearValidity = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    event.currentTarget.setCustomValidity("");
  };

  const nameMessages: FieldMessages = {
    valueMissing: "Пожалуйста, введите ваше имя.",
  };

  const emailMessages: FieldMessages = {
    valueMissing: "Пожалуйста, укажите адрес электронной почты.",
    typeMismatch: "Пожалуйста, введите корректный адрес электронной почты.",
  };

  const phoneMessages: FieldMessages = {
    valueMissing: "Пожалуйста, введите номер телефона.",
    patternMismatch:
      "Введите корректный номер телефона (7–20 символов, можно +, пробелы, скобки и дефис).",
    tooShort:
      "Введите корректный номер телефона (7–20 символов, можно +, пробелы, скобки и дефис).",
    tooLong:
      "Введите корректный номер телефона (7–20 символов, можно +, пробелы, скобки и дефис).",
  };

  const aboutMessages: FieldMessages = {
    valueMissing:
      "Пожалуйста, расскажите немного о себе или оставьте ссылку на Instagram.",
  };

  const consentMessages: FieldMessages = {
    valueMissing: "Пожалуйста, подтвердите согласие, чтобы продолжить.",
  };

  const handleNameInvalid = makeInvalidHandler(nameMessages);
  const handleEmailInvalid = makeInvalidHandler(emailMessages);
  const handlePhoneInvalid = makeInvalidHandler(phoneMessages);
  const handleAboutInvalid = makeInvalidHandler(aboutMessages);
  const handleConsentInvalid = makeInvalidHandler(consentMessages);

  const handlePhoneInput = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    let nextValue = input.value.replace(/[^\d+ ()-]/g, "");

    // Keep "+" only as the first character.
    nextValue = nextValue.replace(/\+/g, (char, index) =>
      index === 0 ? char : "",
    );

    input.value = nextValue;
    input.setCustomValidity("");
  };

  return (
    <section className={styles.section}>
      <form
        ref={formRef}
        className={styles.form}
        action="https://docs.google.com/forms/d/e/1FAIpQLSeXXSXYGdv-glTJ-2CCz3UWWuAcG5U8DBIJjYhr1KMWOtVY9g/formResponse"
        method="POST"
        target="hidden_google_form_iframe"
        onSubmit={handleSubmit}
      >
        <div className={styles.frame}>
          <div className={styles.fieldsLayer}>
            <div className={styles.fieldGroup}>
              <label htmlFor="lead-name" className={styles.label}>
                Ваше имя
              </label>
              <input
                id="lead-name"
                name="entry.484328848"
                type="text"
                placeholder="Ваше имя"
                className={styles.field}
                onInvalid={handleNameInvalid}
                onInput={clearValidity}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="lead-email" className={styles.label}>
                Электронная почта/Email*
              </label>
              <input
                id="lead-email"
                name="entry.632980934"
                type="email"
                placeholder="example@host.com"
                className={styles.field}
                onInvalid={handleEmailInvalid}
                onInput={clearValidity}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="lead-phone" className={styles.label}>
                Номер телефона
                <br />
                <em>(для связи в Tg/WhatsApp)</em>
              </label>
              <input
                id="lead-phone"
                name="entry.1194418700"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="Телефон"
                pattern="[+]?[0-9 ()-]{7,20}"
                minLength={7}
                maxLength={20}
                title="Введите корректный номер телефона (7-20 символов, можно +, пробелы, скобки и дефис)"
                className={styles.field}
                onInvalid={handlePhoneInvalid}
                onInput={handlePhoneInput}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="lead-about" className={styles.label}>
                Instagram или о себе
              </label>
              <textarea
                id="lead-about"
                name="entry.1640079846"
                placeholder="Введите текст"
                className={styles.aboutField}
                onInvalid={handleAboutInvalid}
                onInput={clearValidity}
                required
              />
            </div>
            <p className={styles.aboutCopy}>
              Нам важно, чтобы в этой поездке всем было комфортно в кругу друг
              друга. Поделитесь, пожалуйста, ссылкой на инстаграм и/или
              расскажите в паре слов о себе.
            </p>

            <div className={styles.fieldGroup}>
              <button
                type="submit"
                className={styles.ctaLink}
                disabled={isSubmitting}
                aria-label="Хочу с вами"
              >
                <img
                  src="/images/ХОЧУ-С-ВАМИ 1.png"
                  alt="Хочу с вами"
                  aria-hidden="true"
                  className={styles.ctaImage}
                />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.consentGroup}>
          <div className={styles.consentRow}>
            <input
              id="lead-consent-data"
              name="consentData"
              type="checkbox"
              className={styles.consentCheckbox}
              title="Пожалуйста, подтвердите согласие на обработку персональных данных."
              onInvalid={handleConsentInvalid}
              onChange={clearValidity}
              required
            />
            <label htmlFor="lead-consent-data" className={styles.consentLabel}>
              Я согласен(а) на обработку персональных данных.
            </label>
          </div>

          <div className={styles.consentRow}>
            <input
              id="lead-consent-rules"
              name="consentRules"
              type="checkbox"
              className={styles.consentCheckbox}
              title="Пожалуйста, подтвердите, что вы ознакомились с условиями."
              onInvalid={handleConsentInvalid}
              onChange={clearValidity}
              required
            />
            <label htmlFor="lead-consent-rules" className={styles.consentLabel}>
              Я ознакомился(ась) с условиями участия и согласен(а) с ними.
            </label>
          </div>
        </div>
      </form>
      <iframe
        name="hidden_google_form_iframe"
        title="Google Form submit target"
        className={styles.hiddenIframe}
        onLoad={handleIframeLoad}
      />

      <dialog
        ref={dialogRef}
        className={styles.successDialog}
        aria-labelledby="form-success-title"
        onClose={closeSuccessDialog}
      >
        <div className={styles.successDialogBody}>
          {/* <h2 id="form-success-title" className={styles.successDialogTitle}>
            Спасибо! Ваша заявка отправлена.
          </h2> */}
          <p className={styles.successDialogText}>
            {/* TODO: replace with final copy */}
            Спасибо, ваша анкета у нас 🤍 Мы получили ваши данные и уже начали
            планировать детали нашей встречи в Биаррице. Нам нужно немного
            времени, чтобы свериться с картой комнат и подготовить для вас
            идеальное предложение по размещению.
            <br />
            <br />
            Мы свяжемся с вами в ближайшее время, чтобы подтвердить бронирование
            и ответить на все вопросы.
            <br />
            <br />  До скорой связи!
          </p>
          <button
            type="button"
            className={styles.successDialogClose}
            onClick={closeSuccessDialog}
            aria-label="Закрыть"
          >
            {/* TODO: replace with final CTA copy */}
            Хорошо
          </button>
        </div>
      </dialog>
    </section>
  );
}
