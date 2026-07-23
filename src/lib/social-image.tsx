import { ImageResponse } from "next/og";

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export function createSocialImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#0b0b0c",
        color: "#f5e9d2",
        display: "flex",
        height: "100%",
        padding: 56,
        width: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid rgba(198, 154, 59, 0.48)",
          borderRadius: 28,
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: 54,
          position: "relative",
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(circle at 82% 18%, rgba(139,184,181,.28), transparent 30%), radial-gradient(circle at 12% 92%, rgba(198,154,59,.26), transparent 32%)",
            display: "flex",
            inset: 0,
            position: "absolute",
          }}
        />
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 24,
            justifyContent: "space-between",
            letterSpacing: "0.08em",
            position: "relative",
            textTransform: "uppercase",
          }}
        >
          <span>Mahdi Rashidi</span>
          <span style={{ color: "#c69a3b" }}>Full-stack developer</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            maxWidth: 920,
            position: "relative",
          }}
        >
          <div
            style={{
              color: "#c69a3b",
              display: "flex",
              fontSize: 18,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Brief → build → stable release
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.04,
            }}
          >
            One accountable builder for the whole product.
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            color: "#a69c8e",
            display: "flex",
            fontSize: 20,
            gap: 18,
            position: "relative",
          }}
        >
          <span>Clear scope</span>
          <span style={{ color: "#6f5424" }}>•</span>
          <span>Visible progress</span>
          <span style={{ color: "#6f5424" }}>•</span>
          <span>Dependable delivery</span>
        </div>
      </div>
    </div>,
    socialImageSize,
  );
}
