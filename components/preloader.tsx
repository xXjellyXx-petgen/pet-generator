"use client"

import { useState, useEffect, useRef } from "react"

interface PreloaderProps {
  onComplete: () => void
  videoSrc?: string
  fallbackVideoSrc?: string
  duration?: number
}

export default function Preloader({ onComplete, videoSrc, fallbackVideoSrc, duration = 3000 }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasVideo, setHasVideo] = useState(false)
  const [videoError, setVideoError] = useState("")
  const [debugInfo, setDebugInfo] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    console.log("🎬 Preloader started with duration:", duration)

    // Enhanced browser detection
    const userAgent = typeof window !== "undefined" ? window.navigator.userAgent.toLowerCase() : ""
    const isTikTok = userAgent.includes("tiktok") || userAgent.includes("musically") || userAgent.includes("bytedance")

    setDebugInfo(`
      UserAgent: ${userAgent}
      Is TikTok: ${isTikTok}
      Video Source: ${videoSrc || "Not provided"}
      Window: ${typeof window !== "undefined"}
    `)

    // Check for video if provided
    if (videoSrc) {
      const checkVideo = async () => {
        try {
          console.log("🎬 Checking for video:", videoSrc)

          // Try multiple methods to check video
          const response = await fetch(videoSrc, { method: "HEAD" })
          console.log("🎬 Video HEAD response:", response.status, response.ok)

          if (response.ok) {
            setHasVideo(true)
            console.log("✅ Video found via HEAD request")
          } else {
            console.log("❌ Video HEAD request failed, trying GET...")

            // Fallback: try GET request
            const getResponse = await fetch(videoSrc)
            if (getResponse.ok) {
              setHasVideo(true)
              console.log("✅ Video found via GET request")
            } else {
              setVideoError(`HTTP ${getResponse.status}`)
              setHasVideo(false)
            }
          }
        } catch (error) {
          console.log("🎬 Video check failed:", error)
          setVideoError(error.message)
          setHasVideo(false)
        }
      }
      checkVideo()
    } else {
      console.log("🎬 No videoSrc provided, using animated loading")
      setHasVideo(false)
    }

    // Auto complete after duration
    const timer = setTimeout(() => {
      console.log("🎬 Timer completed, finishing preloader")
      setIsLoading(false)
      setTimeout(() => {
        console.log("🎬 Calling onComplete callback")
        onComplete()
      }, 500)
    }, duration)

    return () => {
      console.log("🎬 Cleaning up preloader timers")
      clearTimeout(timer)
    }
  }, [duration, onComplete, videoSrc])

  const handleVideoEnd = () => {
    console.log("🎬 Video ended, completing preloader")
    setIsLoading(false)
    setTimeout(() => {
      console.log("🎬 Video completion - calling onComplete")
      onComplete()
    }, 300)
  }

  const handleVideoError = (e) => {
    console.warn("🎬 Preloader video failed to load:", e)
    setVideoError("Video load failed")
    setHasVideo(false)
  }

  const handleVideoCanPlay = () => {
    console.log("🎬 Video can play - ready to start")
  }

  const handleVideoLoadStart = () => {
    console.log("🎬 Video load started")
  }

  if (!isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50 animate-out fade-out duration-500">
        <div className="text-white text-2xl font-bold animate-pulse">Loading Complete!</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
      {/* Video Background - ONLY VIDEO, NO OVERLAY */}
      {hasVideo && videoSrc ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleVideoEnd}
            onError={handleVideoError}
            onCanPlay={handleVideoCanPlay}
            onLoadStart={handleVideoLoadStart}
          >
            <source src={videoSrc} type="video/mp4" />
            {fallbackVideoSrc && <source src={fallbackVideoSrc} type="video/webm" />}
          </video>
        </div>
      ) : (
        // Fallback: Simple loading screen if no video
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-pulse">Pet Generator</h1>
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Debug Info - Only in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute bottom-4 left-4 text-xs opacity-80 bg-black/50 rounded p-3 text-white max-w-xs">
          <div className="font-bold mb-2">🔍 Debug Info:</div>
          <pre className="whitespace-pre-wrap text-xs">{debugInfo}</pre>
          <div>Has Video: {hasVideo ? "✅ Yes" : "❌ No"}</div>
          <div>Video Error: {videoError || "None"}</div>
          <div>Status: {hasVideo ? "Playing video" : "Showing fallback"}</div>
          <div>Video Element: {videoRef.current ? "✅ Created" : "❌ Missing"}</div>
        </div>
      )}

      {/* Skip Button - Only visible in development or if video fails */}
      {(process.env.NODE_ENV === "development" || !hasVideo) && (
        <button
          onClick={() => {
            console.log("🎬 Skip button clicked")
            setIsLoading(false)
            onComplete()
          }}
          className="absolute bottom-8 right-8 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
        >
          Skip
        </button>
      )}
    </div>
  )
}
