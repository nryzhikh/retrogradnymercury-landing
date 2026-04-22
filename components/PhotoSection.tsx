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
};

function PhotoTile({
  src,
  alt,
  col,
  row,
  objectPosition = "center 52%",
  hideOnMobile = false,
  priority = false,
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
      <div className={styles.media}>
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

export function PhotoSection({ tiles }: { tiles: Tile[] }) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {tiles.map((tile) => (
          <PhotoTile key={tile.src} {...tile} />
        ))}
      </div>
    </section>
  );
}
