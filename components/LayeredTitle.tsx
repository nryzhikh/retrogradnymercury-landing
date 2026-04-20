import styles from "./LayeredTitle.module.css";

export function LayeredTitle({
  front,
  shadow,
  white = false,
}: {
  front: string;
  shadow?: string;
  white?: boolean;
}) {
  return (
    <span className={`${styles.title} ${white ? styles.titleWhite : ""}`}>
      <span className={styles.titleShadow} aria-hidden="true">
        {shadow ?? front}
      </span>
      <span className={styles.titleFront}>{front}</span>
    </span>
  );
}
