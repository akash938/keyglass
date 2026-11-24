import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "16px",
          background: "linear-gradient(145deg, #1b1e28 0%, #0b0d12 100%)",
          border: "2px solid rgba(255,255,255,0.22)",
        }}
      >
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "linear-gradient(180deg, #3b9eff 0%, #0066e6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: 800,
            boxShadow: "0 4px 12px rgba(0, 122, 255, 0.55)",
          }}
        >
          K
        </div>
      </div>
    ),
    { ...size }
  );
}
