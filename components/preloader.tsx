"use client";

import { useEffect, useRef } from "react";

interface PreloaderProps {
  onComplete: () => void;
  videoSrc?: string;
  fallbackVideoSrc?: string;
}

export default function Preloader({
  onComplete,
  videoSrc = "/videos/preloader.mp4",
  fallbackVideoSrc
}: PreloaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // If video can't play, skip straight to onComplete
    const handleError = () => onComplete();
    video.addEventListener("error", handleError);

    return () => {
      video.removeEventListener("error", handleError);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        onEnded={onComplete}
      >
        <source src={videoSrc} type="video/mp4" />
        {fallbackVideoSrc && (
          <source src={fallbackVideoSrc} type="video/webm" />
        )}
      </video>
    </div>
  );
}
