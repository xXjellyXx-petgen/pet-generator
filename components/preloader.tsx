"use client";

import { useEffect, useState } from "react";

export default function Preloader({ videoSrc = "/videos/preloader3.mp4" }) {
  const [showPreloader, setShowPreloader] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor;
    // TikTok in-app browser contains "TikTok" in the UA
    if (/tiktok/i.test(ua)) {
      setShowPreloader(true);
    }
  }, []);

  if (!showPreloader) {
    return null; // Do nothing if not TikTok
  }

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
    </div>
  );
}
