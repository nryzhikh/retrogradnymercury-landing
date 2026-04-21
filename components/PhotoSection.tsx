import styles from "./PhotoSection.module.css";

type Span = 1 | 2 | 4 | 8 | 16;

export type Tile = {
  src: string;
  alt: string;
  col: Extract<Span, 1 | 2 | 4 | 8 | 16>;
  row: Extract<Span, 2 | 4 | 8 | 16>;
  objectPosition?: string;
  hideOnMobile?: boolean;
};

function PhotoTile({
  src,
  alt,
  col,
  row,
  objectPosition = "center 52%",
  hideOnMobile = false,
}: Tile) {
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
        <img
          src={src}
          alt={alt}
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
