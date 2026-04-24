"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "./FormSection.module.css";
import { ConsentCheckbox } from "./ConsentCheckbox";

export function FormSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);

    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      about: fd.get("about"),
      consentData: fd.get("consentData") === "on",
      consentAds: fd.get("consentAds") === "on",
      consentOffer: fd.get("consentOffer") === "on",
    };

    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error(`status_${res.status}`);
      }
      form.reset();
      setIsSuccess(true);
    } catch (err) {
      console.error("lead submit failed", err);
      setSubmitError(
        "Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
        onSubmit={handleSubmit}
        noValidate={false}
      >
        <div className={styles.frame}>
          <div className={styles.fieldsLayer}>
            <div className={styles.fieldGroup}>
              <label htmlFor="lead-name" className={styles.label}>
                Ваше имя
              </label>
              <input
                id="lead-name"
                name="name"
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
                name="email"
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
                name="phone"
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
                name="about"
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
              {submitError ? (
                <p role="alert" className={styles.submitError}>
                  {submitError}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className={styles.consentGroup}>
          <ConsentCheckbox
            id="lead-consent-data"
            name="consentData"
            title="Пожалуйста, подтвердите согласие на обработку персональных данных"
            onInvalid={handleConsentInvalid}
            onChange={clearValidity}
            required
          >
            Я согласен(а) на{" "}
            <a
              href="https://disk.yandex.ru/i/ASuW8x_Z5FDLrw"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              обработку персональных данных
            </a>
          </ConsentCheckbox>

          <ConsentCheckbox
            id="lead-consent-ads"
            name="consentAds"
            title="Пожалуйста, подтвердите согласие на получение рекламной рассылки"
            onInvalid={handleConsentInvalid}
            onChange={clearValidity}
          >
            Я согласен(а) на{" "}
            <a
              href="https://disk.yandex.ru/i/Cf9Huz2bIyPUqg"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              получение рекламной рассылки
            </a>
          </ConsentCheckbox>

          <ConsentCheckbox
            id="lead-consent-ads"
            name="consentOffer"
            title="Пожалуйста, подтвердите согласие с условиями оферты"
            onInvalid={handleConsentInvalid}
            onChange={clearValidity}
          >
            Я согласен(а) с{" "}
            <a
              href="https://disk.yandex.ru/i/pJMEw_urKjebbA"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              условия оферты
            </a>
          </ConsentCheckbox>
        </div>
      </form>

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
            Хорошо
          </button>
        </div>
      </dialog>
    </section>
  );
}
