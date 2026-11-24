import { ImageResponse } from "next/og";

export const alt = "KeyGlass — Online Keyboard Tester for Every Device";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  const sampleRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #eef2f9 0%, #f7f8fc 50%, #e7eefb 100%)",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "linear-gradient(180deg, #007aff 0%, #0058cc 100%)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: 800,
            }}
          >
            K
          </div>
          <div style={{ fontSize: "30px", fontWeight: 700, color: "#111216", letterSpacing: "-0.02em" }}>
            KeyGlass
          </div>
          <div
            style={{
              marginLeft: "auto",
              padding: "10px 20px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(15,23,42,0.1)",
              color: "#0071e3",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            100% Free • Every Device
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 700,
              color: "#111216",
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
            }}
          >
            Online Keyboard Tester
          </div>
          <div style={{ fontSize: "28px", color: "#525866", maxWidth: "880px", lineHeight: 1.35 }}>
            Test MacBook, Windows, Mechanical, Laptop & Mobile keyboards instantly with NKRO, switch chatter detection, and real-time key diagnostics.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "20px",
            borderRadius: "24px",
            background: "rgba(255,255,255,0.76)",
            border: "1px solid rgba(15,23,42,0.08)",
            boxShadow: "0 20px 50px rgba(15,23,42,0.08)",
          }}
        >
          {sampleRow.map((k, idx) => {
            const isActive = idx === 4;
            const isTested = idx < 4;
            return (
              <div
                key={k}
                style={{
                  flex: 1,
                  height: "76px",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  fontWeight: 600,
                  background: isActive
                    ? "linear-gradient(180deg, #007aff 0%, #0058cc 100%)"
                    : isTested
                      ? "linear-gradient(180deg, #e5faef 0%, #cef5df 100%)"
                      : "#ffffff",
                  color: isActive ? "#ffffff" : isTested ? "#046c4e" : "#111216",
                  border: isActive
                    ? "1px solid rgba(0,122,255,0.5)"
                    : isTested
                      ? "1px solid rgba(16,185,129,0.4)"
                      : "1px solid rgba(15,23,42,0.1)",
                }}
              >
                {k}
              </div>
            );
          })}
        </div>
      </div>
    ),
    { ...size }
  );
}
