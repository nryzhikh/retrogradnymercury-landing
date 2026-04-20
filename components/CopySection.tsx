import styles from "./CopySection.module.css";

export function CopySection({ children }: { children: React.ReactNode }) {
  return (
    <section className={styles.copySection}>
      <div className={`${styles.sectionInner} ${styles.sectionScene}`}>
        <div className={styles.copyContent}>{children}</div>
      </div>
    </section>
  );
}
