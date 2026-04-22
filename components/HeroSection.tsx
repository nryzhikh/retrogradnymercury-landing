import Image from "next/image";
import styles from "./HeroSection.module.css";


export function HeroSection() {
  return (
    <section className={styles.hero}>
        <Image
          src="/images/biarriz-1-3 1_low.jpg"
          alt="Биарриц"
          fill
          priority
          className={styles.heroBg}
        />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={styles.heroContent}>
          <h1 className={styles.heroDates}>18 — 21 июня 2026</h1>
          <div className={styles.heroTextBlock}>
            <p className={styles.heroKicker}>Венера во Льве</p>
            <p className={styles.heroHeadline}>Меркурий в Биаррице</p>
          </div>
          <a className={styles.heroCtaLink} href="#hero-scroll-target">
            <img
              src="/images/ХОЧУ-С-ВАМИ 1.png"
              alt="Хочу с вами"
              className={styles.heroCtaImage}
            />
          </a>
          <img
              src="/images/icon.svg"
              alt="Icon"
              className={styles.heroIcon}
            />
        </div>
      </section>
  );
}