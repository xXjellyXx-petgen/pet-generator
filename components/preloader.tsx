"use client";

import { useEffect, useState } from "react";

export default function Preloader({ videoSrc = "/videos/preloader.mp4" }) {
  const [showInstruction, setShowInstruction] = useState(false);

  useEffect(() => {
    // Detect if inside an in-app browser (like Facebook/Instagram)
    const ua = navigator.userAgent || navigator.vendor;
    if (/FBAN|FBAV|Instagram|Line|Twitter/i.test(ua)) {
      setShowInstruction(true);
    }
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "black", zIndex: 9999 }}>
      <video
        src={videoSrc}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      ></video>

      {showInstruction && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            width: "100%",
            textAlign: "center",
            color: "white",
            fontSize: "16px",
            background: "rgba(0,0,0,0.5)",
            padding: "10px",
          }}
        >
          For more effectivity, tap the 3 dots ••• and open in your browser
        </div>
      )}
    </div>
  );
}
