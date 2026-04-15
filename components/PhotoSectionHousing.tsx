import type { CSSProperties } from "react";

const sectionStyle: CSSProperties = {
  position: "relative",
  overflow: "hidden",
  padding: "clamp(32px, 4vw, 56px) 0",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gridAutoRows: "clamp(100px, 8vw, 170px)",
  gap: "clamp(10px, 1vw, 16px)",
};

const mediaStyle: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  borderRadius: "8px",
  background: "rgba(241, 236, 221, 0.1)",
};

const imageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export function PhotoSectionHousing() {
  return (
    <section style={sectionStyle}>
      <style>{`
        @media (min-width: 900px) {
          .photo-section-grid {
            grid-template-columns: repeat(8, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
      <div className="photo-section-grid" style={gridStyle}>
        <div style={{ gridColumn: "span 2", gridRow: "span 4" }}>
          <div style={mediaStyle}>
            <img
              src="/images/L1000033-RC1 1.png"
              alt="Портрет"
              style={{ ...imageStyle, objectPosition: "center 50%" }}
            />
          </div>
        </div>

        <div style={{ gridColumn: "span 2", gridRow: "span 2" }}>
          <div style={mediaStyle}>
            <img
              src="/images/EXPORT_Casaviel_19-05-23-33 1.png"
              alt="Иллюстрация прогноза"
              style={{ ...imageStyle, objectPosition: "center 52%" }}
            />
          </div>
        </div>

        <div style={{ gridColumn: "span 2", gridRow: "span 2" }}>
          <div style={mediaStyle}>
            <img
              src="/images/EXPORT_Casaviel_18-05-23-39 1.png"
              alt="Иллюстрация прогноза"
              style={{ ...imageStyle, objectPosition: "center 52%" }}
            />
          </div>
        </div>

        <div style={{ gridColumn: "span 2", gridRow: "span 4" }}>
          <div style={mediaStyle}>
            <img
              src="/images/YDWS4217 1.png"
              alt="Иллюстрация прогноза"
              style={{ ...imageStyle, objectPosition: "center 52%" }}
            />
          </div>
        </div>

        <div style={{ gridColumn: "span 1", gridRow: "span 2" }}>
          <div style={mediaStyle}>
            <img
              src="/images/30c81ada-fae7-4b67-8498-c03aafc760de 1.png"
              alt="Иллюстрация прогноза"
              style={{ ...imageStyle, objectPosition: "center 52%" }}
            />
          </div>
        </div>

        <div style={{ gridColumn: "span 1", gridRow: "span 2" }}>
          <div style={mediaStyle}>
            <img
              src="/images/ddd3808a-e6bb-4eb5-8e10-374c2112ccd0 1.png"
              alt="Иллюстрация прогноза"
              style={{ ...imageStyle, objectPosition: "center 52%" }}
            />
          </div>
        </div>

        <div style={{ gridColumn: "span 2", gridRow: "span 2" }}>
          <div style={mediaStyle}>
            <img
              src="images/EXPORT_Casaviel_19-05-23-9 1.png"
              alt="Иллюстрация прогноза"
              style={{ ...imageStyle, objectPosition: "center 52%" }}
            />
          </div>
        </div>


        <div style={{ gridColumn: "span 2", gridRow: "span 2" }}>
          <div style={mediaStyle}>
            <img
              src="images/L1000082-RC1 1.png"
              alt="Иллюстрация прогноза"
              style={{ ...imageStyle, objectPosition: "center 52%" }}
            />
          </div>
        </div>

        <div style={{ gridColumn: "span 1", gridRow: "span 2" }}>
          <div style={mediaStyle}>
            <img
              src="images/EXPORT_Casaviel_19-05-23-23 1.png"
              alt="Иллюстрация прогноза"
              style={{ ...imageStyle, objectPosition: "center 52%" }}
            />
          </div>
        </div>


        <div style={{ gridColumn: "span 1", gridRow: "span 2" }}>
          <div style={mediaStyle}>
            <img
              src="images/8735F68E-DDB4-4596-9D3A-805C76523B59 1.png"
              alt="Иллюстрация прогноза"
              style={{ ...imageStyle, objectPosition: "center 52%" }}
            />
          </div>
        </div>

        <div style={{ gridColumn: "span 2", gridRow: "span 2" }}>
          <div style={mediaStyle}>
            <img
              src="images/77a76f44-ed91-445e-ac5c-5b424dd04ba8 1.png"
              alt="Иллюстрация прогноза"
              style={{ ...imageStyle, objectPosition: "center 52%" }}
            />
          </div>
        </div>

        <div style={{ gridColumn: "span 2", gridRow: "span 2" }}>
          <div style={mediaStyle}>
            <img
              src="images/c6c6f6ad-8ee3-41bb-9db8-8bac76989589 1.png"
              alt="Иллюстрация прогноза"
              style={{ ...imageStyle, objectPosition: "center 52%" }}
            />
          </div>
        </div>





     
      </div>
    </section>
  );
}
