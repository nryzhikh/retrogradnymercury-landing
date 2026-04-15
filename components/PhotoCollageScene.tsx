import type { CSSProperties } from "react";
import styles from "./PhotoCollageScene.module.css";

type PhotoCollageSpan = {
  columns: number;
  rows: number;
};

type PhotoCollageItemCssVars = CSSProperties & {
  "--item-col-span"?: string;
  "--item-row-span"?: string;
  "--item-desktop-col-span"?: string;
  "--item-desktop-row-span"?: string;
};

export type PhotoCollageItem = {
  src: string;
  alt: string;
  objectPosition?: CSSProperties["objectPosition"];
  span?: PhotoCollageSpan;
  desktopSpan?: PhotoCollageSpan;
  className?: string;
  mediaClassName?: string;
  imageClassName?: string;
  cardStyle?: CSSProperties;
  imageStyle?: CSSProperties;
};

function joinClasses(...names: Array<string | undefined>) {
  return names.filter(Boolean).join(" ");
}

export function PhotoCollageScene({
  items,
  className,
  gridClassName,
  cardClassName,
}: {
  items: ReadonlyArray<PhotoCollageItem>;
  className?: string;
  gridClassName?: string;
  cardClassName?: string;
}) {
  return (
    <div className={joinClasses(styles.grid, className, gridClassName)}>
      {items.map((item, index) => {
        const span = item.span ?? { columns: 1, rows: 1 };
        const desktopSpan = item.desktopSpan ?? span;
        const cardStyle: PhotoCollageItemCssVars = {
          "--item-col-span": String(span.columns),
          "--item-row-span": String(span.rows),
          "--item-desktop-col-span": String(desktopSpan.columns),
          "--item-desktop-row-span": String(desktopSpan.rows),
          ...item.cardStyle,
        };

        return (
          <div
            key={`${item.src}-${index}`}
            className={joinClasses(styles.card, cardClassName, item.className)}
            style={cardStyle}
          >
            <div className={joinClasses(styles.media, item.mediaClassName)}>
              <img
                src={item.src}
                alt={item.alt}
                className={joinClasses(styles.image, item.imageClassName)}
                style={{
                  objectPosition: item.objectPosition,
                  ...item.imageStyle,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
