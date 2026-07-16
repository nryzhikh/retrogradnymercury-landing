import Image from "next/image";
import styles from "./HeroSection.module.css";


export function HeroSection() {
  return (
    <section className={styles.hero}>
        <Image
          src="/images/tashkent/tashkent-hero-bg-low.webp"
          alt="Ташкент"
          fill
          priority
          className={styles.heroBg}
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroDates}>7 — 11 октября 2026</h1>
          <div className={styles.heroTextBlock}>
            <p className={styles.heroKicker}>Юпитер во Льве</p>
            <p className={styles.heroHeadline}>Меркурий в Ташкенте</p>
          </div>
          <a className={styles.heroCtaLink} href="#hero-scroll-target">
            <Image
              src="/images/tashkent/tashkent-cta-button.png"
              alt="Хочу с вами"
              className={styles.heroCtaImage}
              width={800}
              height={800}
            />
          </a>
          {/* <img
              src="/images/icon.svg"
              alt="Icon"
              className={styles.heroIcon}
            /> */}
        </div>
      </section>
  );
}