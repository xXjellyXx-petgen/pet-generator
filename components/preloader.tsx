"use client"

import { useState, useEffect, useRef } from "react"
import { ExternalLink, Chrome, AlertTriangle } from "lucide-react"

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
  const [isInAppBrowser, setIsInAppBrowser] = useState(false)
  const [showBrowserWarning, setShowBrowserWarning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Detect if user is in an in-app browser
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    const inApp = /Instagram|FBAN|FBAV|Twitter|Line|WhatsApp|Telegram|TikTok|LinkedIn|Snapchat|Pinterest|Reddit/i.test(
      userAgent,
    )

    console.log("🔍 User Agent:", userAgent)
    console.log("📱 In-app browser detected:", inApp)

    setIsInAppBrowser(inApp)

    // If in app browser, show warning immediately and don't proceed with normal loading
    if (inApp) {
      setShowBrowserWarning(true)
      return // Don't start normal preloader sequence
    }

    console.log("🎬 Preloader started with duration:", duration)

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

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          console.log("🎬 Progress completed at 100%")
          return 100
        }
        const newProgress = prev + Math.random() * 15
        return newProgress
      })
    }, 100)

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
      clearInterval(progressInterval)
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

  const handleVideoError = () => {
    console.warn("🎬 Preloader video failed to load, using fallback animation")
    setHasVideo(false)
  }

  const openInBrowser = () => {
    const currentUrl = window.location.href
    console.log("🌐 Opening in browser:", currentUrl)

    // Try multiple methods to open in browser
    try {
      // Method 1: Direct window.open
      window.open(currentUrl, "_blank", "noopener,noreferrer")

      // Method 2: Create a temporary link and click it
      const link = document.createElement("a")
      link.href = currentUrl
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Method 3: Try to use location.href as fallback
      setTimeout(() => {
        window.location.href = currentUrl
      }, 1000)
    } catch (error) {
      console.error("Failed to open in browser:", error)
      // Fallback: show instructions
      alert("Please copy this URL and paste it in your browser:\n\n" + currentUrl)
    }
  }

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert("✅ URL copied! Now paste it in your browser (Chrome, Safari, Firefox)")
    } catch (error) {
      console.error("Failed to copy URL:", error)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = window.location.href
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      alert("✅ URL copied! Now paste it in your browser (Chrome, Safari, Firefox)")
    }
  }

  // Show browser warning screen for in-app browsers
  if (isInAppBrowser && showBrowserWarning) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-500 via-red-400 to-orange-400 flex flex-col items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md mx-auto text-center shadow-2xl">
          <div className="mb-6">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Browser Required</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Pet Generator needs to run in a proper browser to work correctly. In-app browsers can't access all the
              features needed to claim your pets.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Chrome className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Recommended Browsers</span>
              </div>
              <p className="text-blue-700 text-sm">Chrome • Safari • Firefox • Edge</p>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold text-yellow-800 text-sm">Why This Matters</span>
              </div>
              <p className="text-yellow-700 text-xs leading-relaxed">
                In-app browsers have security restrictions that prevent pet claiming, Roblox account connections, and
                other essential features.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={openInBrowser}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-5 w-5" />
              Open in Browser
            </button>

            <button
              onClick={copyUrlToClipboard}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-sm"
            >
              Copy URL to Clipboard
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
              <strong>How to open in browser:</strong>
              <br />
              1. Tap "Open in Browser" above
              <br />
              2. Or copy the URL and paste it in your browser
              <br />
              3. Then you can claim your pets! 🎉
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Normal preloader for proper browsers
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

        {/* Progress Bar */}
        <div className="w-80 max-w-sm mx-auto mb-8">
          <div className="bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-sm opacity-75">{Math.round(Math.min(progress, 100))}% Complete</p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center">
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
            <div>In-App Browser: {isInAppBrowser ? "❌ Yes" : "✅ No"}</div>
            <div>Status: {hasVideo ? "Playing video" : "Showing animation"}</div>
          </div>
        )}
      </div>

      {/* Skip Button - Only show for proper browsers */}
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
    </div>
  )
}
