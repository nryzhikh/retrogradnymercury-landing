import styles from "./PhotoSection.module.css";


type Span = 1 | 2 | 4 | 8 | 16;

export type Tile = {
  src: string;
  alt: string;
  col: Extract<Span, 1 | 2 | 4 | 8 | 16>;
  row: Extract<Span, 2 | 4 | 8 | 16>;
  objectPosition?: string;
};

const colSpan: Record<Tile["col"], string> = {
  1: "col-span-1",
  2: "col-span-2",
  4: "col-span-4",
  8: "col-span-8",
  16: "col-span-16",
};

const rowSpan: Record<Tile["row"], string> = {
  2: "row-span-2",
  4: "row-span-4",
  8: "row-span-8",
  16: "row-span-16",
};

const tiles: Tile[] = [
  { src: "/images/L1000033-RC1 1.png", alt: "img1", col: 2, row: 4, objectPosition: "center 50%" },
  { src: "/images/EXPORT_Casaviel_19-05-23-33 1.png", alt: "img2", col: 2, row: 2 },
  { src: "/images/EXPORT_Casaviel_18-05-23-39 1.png", alt: "img3", col: 2, row: 2 },
  { src: "/images/YDWS4217 1.png", alt: "img4", col: 2, row: 4 },
  { src: "/images/30c81ada-fae7-4b67-8498-c03aafc760de 1.png", alt: "img5", col: 1, row: 2 },
  { src: "/images/ddd3808a-e6bb-4eb5-8e10-374c2112ccd0 1.png", alt: "img6", col: 1, row: 2 },
  { src: "/images/EXPORT_Casaviel_19-05-23-9 1.png", alt: "img7", col: 2, row: 2 },
  { src: "/images/L1000082-RC1 1.png", alt: "img8", col: 2, row: 2 },
  { src: "/images/EXPORT_Casaviel_19-05-23-23 1.png", alt: "img9", col: 1, row: 2 },
  { src: "/images/8735F68E-DDB4-4596-9D3A-805C76523B59 1.png", alt: "img10", col: 1, row: 2 },
  { src: "/images/77a76f44-ed91-445e-ac5c-5b424dd04ba8 1.png", alt: "img11", col: 2, row: 2 },
  { src: "/images/c6c6f6ad-8ee3-41bb-9db8-8bac76989589 1.png", alt: "img12", col: 2, row: 2 },
];

function PhotoTile({ src, alt, col, row, objectPosition = "center 52%" }: Tile) {
  return (
    <div style={{ gridColumn: `span ${col}`, gridRow: `span ${row}` }}>
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
