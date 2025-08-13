"use client"

import { useState, useEffect, useRef } from "react"

interface PreloaderProps {
  onComplete: () => void
  videoSrc?: string
  fallbackVideoSrc?: string
  duration?: number
}

export default function Preloader({
  onComplete,
  videoSrc = "/videos/preloader.mp4",
  fallbackVideoSrc = "/videos/preloader.webm",
  duration = 3000,
}: PreloaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
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
    }
  }, [duration, onComplete])

  const handleVideoEnd = () => {
    setIsLoading(false)
    setTimeout(onComplete, 300)
  }

  const handleVideoError = () => {
    console.warn("Preloader video failed to load, using fallback")
    // Continue with loading animation
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
      {/* Video Background */}
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
          <source src={fallbackVideoSrc} type="video/webm" />
          {/* Fallback for browsers that don't support video */}
        </video>
      </div>

      {/* Loading Content Overlay */}
      <div className="relative z-10 text-center text-white">
        {/* Logo/Title */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-2 animate-pulse">Pet & Seed Store</h1>
          <p className="text-lg md:text-xl opacity-90">Loading your adventure...</p>
        </div>

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
