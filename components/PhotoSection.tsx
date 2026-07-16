import Image from "next/image";
import styles from "./PhotoSection.module.css";

type Span = 1 | 2 | 4 | 8 | 16;

export type Tile = {
  src: string;
  alt: string;
  col: Extract<Span, 1 | 2 | 4 | 8 | 16>;
  row: Extract<Span, 2 | 4 | 8 | 16>;
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
  const sizes = `(min-width: 900px) ${(col / 8) * 100}vw, ${(col / 4) * 100}vw`;

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
