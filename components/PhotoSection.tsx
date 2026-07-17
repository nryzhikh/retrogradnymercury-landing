import Image from "next/image";
import styles from "./PhotoSection.module.css";

/** 12-column grid: 3 equal → col 4, 4 equal → col 3, 2 equal → col 6 */
export type Tile = {
  src: string;
  alt: string;
  col: number;
  row: number;
  objectPosition?: string;
  hideOnMobile?: boolean;
  priority?: boolean;
  rounded?: boolean;
};

function PhotoTile({
  src,
  alt,
  col,
  row,
  objectPosition = "center 52%",
  hideOnMobile = false,
  priority = false,
  rounded = false,
}: Tile) {
  const sizes = `${(col / 12) * 100}vw`;

  return (
    <div
      className={`${styles.tile} ${hideOnMobile ? styles.hideOnMobile : ""}`}
      style={{
        gridColumn: `span ${col}`,
        gridRow: `span ${row}`,
        ["--col" as string]: col,
        ["--row" as string]: row,
      }}
    >
      <div className={`${styles.media} ${rounded ? styles.rounded : ""}`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={styles.image}
          style={{ objectPosition }}
        />
      </div>
    </div>
  );
}

export function PhotoSection({
  tiles,
  gap = 0,
}: {
  tiles: Tile[];
  /** Grid gap — number (px) or any CSS gap value, e.g. `"12px"` / `"8px 16px"` */
  gap?: number | string;
}) {
  const gapValue = typeof gap === "number" ? `${gap}px` : gap;

  return (
    <section className={styles.section}>
      <div className={styles.grid} style={{ gap: gapValue }}>
        {tiles.map((tile) => (
          <PhotoTile key={tile.src} {...tile} />
        ))}
      </div>
    </section>
  );
}
