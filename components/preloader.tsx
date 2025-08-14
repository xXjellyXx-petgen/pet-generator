"use client"

import { useState, useEffect, useRef } from "react"
import { ExternalLink, Chrome, Globe } from "lucide-react"

interface PreloaderProps {
  onComplete: () => void
  videoSrc?: string
  fallbackVideoSrc?: string
  duration?: number
}

export default function Preloader({ onComplete, videoSrc, fallbackVideoSrc, duration = 3000 }: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [hasVideo, setHasVideo] = useState(false)
  const [showBrowserInstructions, setShowBrowserInstructions] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Only check for video if videoSrc is provided
    if (videoSrc) {
      const checkVideo = async () => {
        try {
          console.log("🎬 Checking for video:", videoSrc)
          const response = await fetch(videoSrc, { method: "HEAD" })
          console.log("🎬 Video check response:", response.ok)
          setHasVideo(response.ok)
        } catch (error) {
          console.log("🎬 Video check failed:", error)
          setHasVideo(false)
        }
      }
      checkVideo()
    } else {
      console.log("🎬 No videoSrc provided, using animated loading")
      setHasVideo(false)
    }

    // Show browser instructions after 2 seconds
    const instructionTimer = setTimeout(() => {
      setShowBrowserInstructions(true)
    }, 2000)

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    // Auto complete after duration
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(onComplete, 500) // Small delay for smooth transition
    }, duration)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(timer)
      clearTimeout(instructionTimer)
    }
  }, [duration, onComplete, videoSrc])

  const handleVideoEnd = () => {
    setIsLoading(false)
    setTimeout(onComplete, 300)
  }

  const handleVideoError = () => {
    console.warn("🎬 Preloader video failed to load, using fallback animation")
    setHasVideo(false)
  }

  const openInBrowser = () => {
    // Try to detect if we're in an app webview
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    const isInApp = /Instagram|FBAN|FBAV|Twitter|Line|WhatsApp|Telegram/i.test(userAgent)

    if (isInApp) {
      // Show instructions for in-app browsers
      alert("📱 Please open this link in your browser (Chrome, Safari, Firefox) for the best experience!")
    }

    // Always try to open in default browser
    const currentUrl = window.location.href
    window.open(currentUrl, "_blank", "noopener,noreferrer")
  }

  if (!isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-400 via-cyan-300 to-blue-400 flex items-center justify-center z-50 animate-out fade-out duration-500">
        <div className="text-white text-2xl font-bold animate-pulse">Loading Complete!</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cyan-400 via-cyan-300 to-blue-400 flex flex-col items-center justify-center z-50">
      {/* Video Background - Only show if video exists */}
      {hasVideo && videoSrc && (
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover opacity-80"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnd}
            onError={handleVideoError}
          >
            <source src={videoSrc} type="video/mp4" />
            {fallbackVideoSrc && <source src={fallbackVideoSrc} type="video/webm" />}
          </video>
        </div>
      )}

      {/* Loading Content Overlay */}
      <div className="relative z-10 text-center text-white max-w-md mx-auto px-4">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 animate-pulse">Pet Generator</h1>
          <p className="text-lg md:text-xl opacity-90">Loading your adventure...</p>
        </div>

        {/* Browser Instructions - Show after 2 seconds */}
        {showBrowserInstructions && (
          <div className="mb-6 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Globe className="h-5 w-5" />
              <span className="font-semibold text-sm">For Best Experience</span>
            </div>
            <p className="text-sm mb-3 opacity-90">Please open this page in your browser for full functionality</p>
            <div className="flex items-center justify-center gap-2 text-xs opacity-80 mb-3">
              <Chrome className="h-4 w-4" />
              <span>Chrome • Safari • Firefox</span>
            </div>
            <button
              onClick={openInBrowser}
              className="bg-white/30 hover:bg-white/40 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium flex items-center gap-2 mx-auto"
            >
              <ExternalLink className="h-4 w-4" />
              Open in Browser
            </button>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-80 max-w-sm mx-auto">
          <div className="bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-sm opacity-75">{Math.round(Math.min(progress, 100))}% Complete</p>
        </div>

        {/* Loading Animation */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>

        {/* Debug Info - Shows what's happening */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-4 text-xs opacity-60 bg-black/20 rounded p-2">
            <div>Video Source: {videoSrc || "Not provided"}</div>
            <div>Has Video: {hasVideo ? "✅ Yes" : "❌ No"}</div>
            <div>Status: {hasVideo ? "Playing video" : "Showing animation"}</div>
          </div>
        )}
      </div>

      {/* Skip Button */}
      <button
        onClick={() => {
          setIsLoading(false)
          onComplete()
        }}
        className="absolute bottom-8 right-8 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm"
      >
        Skip
      </button>
    </div>
  )
}
