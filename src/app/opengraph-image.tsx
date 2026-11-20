import { ImageResponse } from "next/og";

export const alt = "Marea Travel — Joyería marina en acero inoxidable 316L en Colombia";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#F6F4EF",
        color: "#0F2438",
        padding: "72px 84px",
        border: "16px solid #EDE9E0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#0F2438",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#F6F4EF",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            M
          </div>
          <span
            style={{
              fontSize: "22px",
              letterSpacing: "0.22em",
              fontWeight: 700,
              color: "#0F2438",
            }}
          >
            MAREA TRAVEL
          </span>
        </div>

        <span
          style={{
            fontSize: "18px",
            letterSpacing: "0.14em",
            color: "#7A5C24",
            fontWeight: 600,
          }}
        >
          SOL · SAL · ACERO 316L
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "900px" }}>
        <span
          style={{
            fontSize: "68px",
            lineHeight: 1.05,
            fontWeight: 600,
            fontFamily: "Georgia, serif",
            color: "#0F2438",
          }}
        >
          Joyería marina en acero 316L, hecha para el sol y la sal.
        </span>
        <span
          style={{
            fontSize: "26px",
            lineHeight: 1.4,
            color: "#435668",
          }}
        >
          Accesorios minimalistas resistentes al mar y al uso diario. Envíos a toda Colombia.
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "2px solid #DFD9CE",
          paddingTop: "24px",
          fontSize: "20px",
          color: "#435668",
        }}
      >
        <span>Acero quirúrgico 316L · Hipoalergénico</span>
        <span style={{ color: "#164E63", fontWeight: 600 }}>mareatravel.co</span>
      </div>
    </div>,
    { ...size },
  );
}
