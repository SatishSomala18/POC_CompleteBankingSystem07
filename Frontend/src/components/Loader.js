import React from "react";

/* ── Inline keyframes (injected once via a <style> tag) ───────────────────
   No external CSS file needed — this self-contained component can drop
   into any project and the animation will just work. ────────────────────── */
const animationStyles = `
@keyframes cardFloat {
  0%, 100% { transform: translateY(0px) rotate(-2deg); }
  50%      { transform: translateY(-10px) rotate(2deg); }
}
@keyframes cardShine {
  0%   { left: -60%; }
  100% { left: 130%; }
}
@keyframes coinSpin {
  0%   { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}
@keyframes dotPulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40%           { transform: scale(1);   opacity: 1;   }
}
`;

function Loader() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
      <style>{animationStyles}</style>

      {/* ── Bank Card ─────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          width: "110px",
          height: "70px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, #312e81 0%, #4f46e5 100%)",
          boxShadow: "0 8px 20px rgba(49,46,129,0.35)",
          animation: "cardFloat 2.2s ease-in-out infinite",
          overflow: "hidden",
        }}
      >
        {/* Shine sweep */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "-60%",
            width: "40%",
            height: "100%",
            background: "linear-gradient(120deg, transparent, rgba(255,255,255,0.35), transparent)",
            animation: "cardShine 1.8s ease-in-out infinite",
          }}
        />

        {/* Chip */}
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "12px",
            width: "20px",
            height: "14px",
            borderRadius: "3px",
            background: "rgba(250, 204, 21, 0.9)",
          }}
        />

        {/* Card lines */}
        <div
          style={{
            position: "absolute",
            bottom: "14px",
            left: "12px",
            width: "60px",
            height: "4px",
            borderRadius: "2px",
            backgroundColor: "rgba(255,255,255,0.5)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "22px",
            left: "12px",
            width: "40px",
            height: "4px",
            borderRadius: "2px",
            backgroundColor: "rgba(255,255,255,0.3)",
          }}
        />

        {/* Bank icon, top right */}
        <i
          className="bi bi-bank2"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "rgba(255,255,255,0.85)",
            fontSize: "16px",
          }}
        ></i>
      </div>

      {/* ── Spinning coin beneath the card ───────────────────────────── */}
      <div
        style={{
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f59e0b, #d97706)",
          marginTop: "22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 3px 8px rgba(217,119,6,0.4)",
          animation: "coinSpin 1.4s linear infinite",
          fontWeight: "700",
          fontSize: "12px",
          color: "#7c4a03",
        }}
      >
        ₹
      </div>

      {/* ── Loading text with pulsing dots ───────────────────────────── */}
      <div className="d-flex align-items-center gap-1 mt-3">
        <span className="text-muted fw-semibold small">Loading</span>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#4f46e5",
              display: "inline-block",
              animation: `dotPulse 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          ></span>
        ))}
      </div>

    </div>
  );
}

export default Loader;