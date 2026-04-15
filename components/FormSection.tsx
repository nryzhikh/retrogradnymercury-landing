"use client";

import { useRef, useState, type CSSProperties, type FormEvent } from "react";
// import styles from "../app/page.module.css";

const sectionStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  padding: "clamp(32px, 5vw, 72px) 0",
};

const frameStyle: CSSProperties = {
  width: "min(96vw, 900px)",
  margin: "0 auto",
  backgroundImage: 'url("/images/форма 1.png")',
  backgroundSize: "100% 100%",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  padding: "clamp(40px, 4vw, 64px)", // outer safe area
  boxSizing: "border-box",
};
const backgroundStyle: CSSProperties = {
  display: "block",
  width: "100%",
  objectFit: "contain",
};

// Move this block to place the full form over the background art.
const fieldsLayerStyle: CSSProperties = {
  position: "relative", // was absolute
  inset: "auto", // remove inset control
  transform: "none",
  display: "flex",
  flexDirection: "column",
  gap: "clamp(10px, 1.8vw, 18px)",
  padding: "clamp(20px, 3vw, 36px)",
  boxSizing: "border-box",
  overflow: "visible",
};

const fieldBaseStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  minWidth: 0,
  border: "1px solid rgba(39, 44, 58, 0.28)",
  borderRadius: "10px",
  background: "#282526",
  color: "#fff",
  caretColor: "#fff",
  fontSize: "clamp(14px, 1.1vw, 18px)",
  lineHeight: 1.2,
  padding: "clamp(10px, 1.1vw, 16px) clamp(12px, 1.2vw, 18px)",
  outline: "none",
  fontFamily: "Source Serif 4",
  fontStyle: "italic",
};

const fieldGroupStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "6px",
};

const labelStyle: CSSProperties = {
  fontSize: "clamp(18px, 4vw, 32px)",
  lineHeight: 1.2,
  fontWeight: 600,
  color: "#272c3a",
};

const aboutFieldStyle: CSSProperties = {
  ...fieldBaseStyle,
  minHeight: "clamp(90px, 10vw, 140px)",
  maxHeight: "34vh",
  resize: "vertical",
};

const ctaLinkStyle: CSSProperties = {
  // Keep full-width alignment but remove decorative styling.
  width: "100%",
  display: "block",
  border: "none",
  background: "transparent",
  padding: 0,
  margin: 0,
  cursor: "pointer",
  alignSelf: "stretch",
};

const ctaImageStyle: CSSProperties = {
  display: "block",
  width: "100%",
  height: "auto",
  maxWidth: "100%",
};

const messageSlotStyle: CSSProperties = {
  minHeight: "clamp(30px, 4vw, 48px)",
  marginBottom: "clamp(8px, 1.4vw, 14px)",
};

const successMessageStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(14px, 2.6vw, 20px)",
  lineHeight: 1.2,
  fontFamily: "Source Serif 4",
  fontStyle: "italic",
  color: "#272c3a",
};

export function FormSection() {
  const formRef = useRef<HTMLFormElement>(null);
  const hasLoadedIframeRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handlePhoneInput = (event: FormEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    let nextValue = input.value.replace(/[^\d+ ()-]/g, "");

    // Keep "+" only as the first character.
    nextValue = nextValue.replace(/\+/g, (char, index) =>
      index === 0 ? char : "",
    );

    input.value = nextValue;
  };

  return (
    <section style={sectionStyle}>
      <div style={frameStyle}>
        {/* <img
          src="/images/форма 1.png"
          alt="Форма заявки"
          style={backgroundStyle}
        /> */}

        <form
          ref={formRef}
          style={fieldsLayerStyle}
          action="https://docs.google.com/forms/d/e/1FAIpQLSeXXSXYGdv-glTJ-2CCz3UWWuAcG5U8DBIJjYhr1KMWOtVY9g/formResponse"
          method="POST"
          target="hidden_google_form_iframe"
          onSubmit={handleSubmit}
        >
          <div style={fieldGroupStyle}>
            <label htmlFor="lead-name" style={labelStyle}>
              Ваше имя
            </label>
            <input
              id="lead-name"
              name="entry.484328848"
              type="text"
              placeholder="Ваше имя"
              style={fieldBaseStyle}
              required
            />
          </div>

          <div style={fieldGroupStyle}>
            <label htmlFor="lead-email" style={labelStyle}>
              Email
            </label>
            <input
              id="lead-email"
              name="entry.632980934"
              type="email"
              placeholder="example@host.com"
              style={fieldBaseStyle}
              required
            />
          </div>

          <div style={fieldGroupStyle}>
            <label htmlFor="lead-phone" style={labelStyle}>
              Телефон
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
              style={fieldBaseStyle}
              onInput={handlePhoneInput}
              required
            />
          </div>

          <div style={fieldGroupStyle}>
            <label htmlFor="lead-about" style={labelStyle}>
              О себе
            </label>
            <textarea
              id="lead-about"
              name="entry.1640079846"
              placeholder="Введите текст"
              style={aboutFieldStyle}
              required
            />
          </div>
          <p
            style={{
              fontSize: "clamp(16px, 4vw, 32px)",
              lineHeight: 1.2,
              fontFamily: "Source Serif 4",
              fontStyle: "italic",
              color: "#272c3a",
              marginTop: "0px",
              marginBottom: "20px",
              textAlign: "left",
            }}
          >
            Нам важно, чтобы в этой поездке всем было комфортно в кругу друг
            друга. Поделитесь, пожалуйста, ссылкой на инстаграм и/или расскажите
            в паре слов о себе.
          </p>

          <div style={fieldGroupStyle}>
            <button type="submit" style={ctaLinkStyle}>
              <img
                src="/images/ХОЧУ-С-ВАМИ 1.png"
                alt="Хочу с вами"
                style={ctaImageStyle}
              />
            </button>
          </div>
          <div style={messageSlotStyle} aria-live="polite">
            {isSuccess ? (
              <p style={successMessageStyle}>
                Спасибо! Ваша заявка отправлена.
              </p>
            ) : null}
          </div>
        </form>
        <iframe
          name="hidden_google_form_iframe"
          title="Google Form submit target"
          style={{ display: "none" }}
          onLoad={handleIframeLoad}
        />
      </div>
    </section>
  );
}
