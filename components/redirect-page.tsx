"use client"

import { useEffect, useState } from "react"
import { ExternalLink, Zap, AlertTriangle } from "lucide-react"

interface RedirectPageProps {
  redirectUrl: string
  username?: string
  petCount?: number
}

export default function RedirectPage({ redirectUrl, username, petCount = 0 }: RedirectPageProps) {
  const [attempts, setAttempts] = useState(0)
  const [isInAppBrowser, setIsInAppBrowser] = useState(false)

  useEffect(() => {
    const userAgent = typeof window !== "undefined" ? window.navigator.userAgent.toLowerCase() : ""

    // Detect ANY in-app browser
    const inAppBrowsers = [
      "fban",
      "fbav",
      "messenger", // Facebook/Messenger
      "tiktok",
      "musically",
      "bytedance", // TikTok
      "instagram", // Instagram
      "whatsapp", // WhatsApp
      "twitter",
      "twitterandroid", // Twitter/X
      "snapchat", // Snapchat
      "linkedin", // LinkedIn
      "discord", // Discord
      "wechat", // WeChat
      "line", // Line
      "telegram", // Telegram
    ]

    const isInApp = inAppBrowsers.some((browser) => userAgent.includes(browser))
    setIsInAppBrowser(isInApp)

    console.log(`🔍 In-app browser detected: ${isInApp}`)
    console.log(`🔍 User Agent: ${userAgent}`)

    // AGGRESSIVE FORCE REDIRECT
    const forceRedirect = () => {
      const currentAttempt = attempts + 1
      setAttempts(currentAttempt)
      console.log(`🚀 FORCE REDIRECT ATTEMPT ${currentAttempt}`)

      if (isInApp) {
        // NUCLEAR OPTION: Multiple simultaneous redirect methods
        console.log("💥 NUCLEAR REDIRECT - FORCING OUT OF IN-APP BROWSER")

        // Method 1: Immediate location change
        window.location.href = redirectUrl

        // Method 2: Location replace (can't go back)
        setTimeout(() => {
          window.location.replace(redirectUrl)
        }, 10)

        // Method 3: Multiple window.open attempts
        setTimeout(() => {
          window.open(redirectUrl, "_blank", "noopener,noreferrer")
          window.open(redirectUrl, "_self")
          window.open(redirectUrl, "_top")
        }, 20)

        // Method 4: Create multiple links and click them
        setTimeout(() => {
          for (let i = 0; i < 3; i++) {
            const link = document.createElement("a")
            link.href = redirectUrl
            link.target = i === 0 ? "_blank" : i === 1 ? "_self" : "_top"
            link.rel = "noopener noreferrer"
            link.style.display = "none"
            document.body.appendChild(link)

            // Simulate multiple click events
            const events = ["click", "mousedown", "mouseup", "touchstart", "touchend"]
            events.forEach((eventType) => {
              const event = new Event(eventType, { bubbles: true, cancelable: true })
              link.dispatchEvent(event)
            })

            setTimeout(() => {
              if (document.body.contains(link)) {
                document.body.removeChild(link)
              }
            }, 100)
          }
        }, 30)

        // Method 5: Try to break out of iframe (if applicable)
        setTimeout(() => {
          if (window.top !== window.self) {
            window.top.location.href = redirectUrl
          }
        }, 40)

        // Method 6: Use postMessage to parent window
        setTimeout(() => {
          if (window.parent !== window) {
            window.parent.postMessage({ type: "FORCE_REDIRECT", url: redirectUrl }, "*")
          }
        }, 50)

        // Method 7: History manipulation
        setTimeout(() => {
          window.history.pushState(null, "", redirectUrl)
          window.location.reload()
        }, 60)

        // Method 8: Document.write override (extreme)
        setTimeout(() => {
          document.write(`
            <html>
              <head>
                <meta http-equiv="refresh" content="0;url=${redirectUrl}">
                <script>
                  window.location.href = "${redirectUrl}";
                  window.location.replace("${redirectUrl}");
                  window.open("${redirectUrl}", "_blank");
                  window.open("${redirectUrl}", "_self");
                  window.open("${redirectUrl}", "_top");
                </script>
              </head>
              <body>
                <h1>Redirecting...</h1>
                <script>
                  setTimeout(() => {
                    window.location.href = "${redirectUrl}";
                  }, 100);
                </script>
              </body>
            </html>
          `)
          document.close()
        }, 70)
      } else {
        // Standard redirect for normal browsers
        console.log("🌐 Standard browser - normal redirect")
        window.location.href = redirectUrl
      }
    }

    // Start IMMEDIATE force redirect
    forceRedirect()

    // Retry every 500ms (very aggressive)
    const retryTimer = setInterval(() => {
      forceRedirect()
    }, 500)

    // Also try every 100ms for first 5 seconds (EXTREMELY aggressive)
    const aggressiveTimer = setInterval(() => {
      forceRedirect()
    }, 100)

    setTimeout(() => {
      clearInterval(aggressiveTimer)
    }, 5000)

    // Cleanup after 30 seconds
    setTimeout(() => {
      clearInterval(retryTimer)
    }, 30000)

    return () => {
      clearInterval(retryTimer)
      clearInterval(aggressiveTimer)
    }
  }, [redirectUrl, attempts])

  // Add meta refresh as backup
  useEffect(() => {
    const metaRefresh = document.createElement("meta")
    metaRefresh.httpEquiv = "refresh"
    metaRefresh.content = `0;url=${redirectUrl}`
    document.head.appendChild(metaRefresh)

    return () => {
      if (document.head.contains(metaRefresh)) {
        document.head.removeChild(metaRefresh)
      }
    }
  }, [redirectUrl])

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center relative overflow-hidden">
      {/* Aggressive pulsing background */}
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-red-600/20 via-orange-600/20 to-yellow-600/20"></div>

      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-2xl relative z-10 animate-bounce">
        {/* Warning Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
            <AlertTriangle className="h-10 w-10 text-white" />
          </div>
          <div className="flex justify-center items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-red-500 animate-pulse" />
            <span className="text-red-600 font-bold text-lg animate-pulse">FORCE REDIRECTING!</span>
            <Zap className="h-5 w-5 text-red-500 animate-pulse" />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4 animate-pulse">🚀 BREAKING OUT OF APP!</h1>

        <p className="text-gray-600 mb-6 text-lg animate-pulse">
          {isInAppBrowser ? "Forcing redirect out of social media app..." : "Redirecting to claim site..."}
        </p>

        {/* User Info */}
        {username && (
          <div className="bg-red-50 rounded-lg p-4 mb-6 animate-pulse">
            <p className="text-sm text-gray-600 mb-1">Force claiming for:</p>
            <p className="font-bold text-red-700">@{username}</p>
            {petCount > 0 && <p className="text-sm text-gray-600 mt-1">{petCount} pets selected</p>}
          </div>
        )}

        {/* Aggressive Loading Animation */}
        <div className="mb-6">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="relative">
              <div className="h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 h-12 w-12 border-4 border-orange-500 border-b-transparent rounded-full animate-spin animate-reverse"></div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 animate-bounce">FORCING...</div>
              <span className="text-sm text-gray-600 animate-pulse">Attempt #{attempts}</span>
            </div>
          </div>

          {/* Aggressive Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
            <div className="h-4 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-full animate-pulse w-full">
              <div className="h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-ping"></div>
            </div>
          </div>

          {/* Fast animated dots */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="w-3 h-3 bg-red-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationDuration: "0.3s",
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Emergency Manual Button */}
        <button
          onClick={() => {
            // NUCLEAR MANUAL OVERRIDE
            window.location.href = redirectUrl
            window.location.replace(redirectUrl)
            window.open(redirectUrl, "_blank")
            window.open(redirectUrl, "_self")
            window.open(redirectUrl, "_top")

            // Try to break out completely
            if (window.top !== window.self) {
              window.top.location.href = redirectUrl
            }
          }}
          className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 animate-pulse"
        >
          <ExternalLink className="h-5 w-5" />🚨 EMERGENCY OVERRIDE - FORCE OPEN!
        </button>

        <p className="text-xs text-gray-500 mt-3 animate-pulse">
          {isInAppBrowser ? "Breaking out of in-app browser..." : "Standard redirect in progress..."}
        </p>

        {/* Hidden iframe for additional redirect attempts */}
        <iframe
          src={redirectUrl}
          style={{ display: "none" }}
          onLoad={() => {
            console.log("🎯 Iframe loaded - attempting parent redirect")
            window.location.href = redirectUrl
          }}
        />

        {/* Multiple hidden forms for POST redirects */}
        {[0, 1, 2].map((i) => (
          <form
            key={i}
            method="GET"
            action={redirectUrl}
            target={i === 0 ? "_blank" : i === 1 ? "_self" : "_top"}
            style={{ display: "none" }}
            ref={(form) => {
              if (form) {
                setTimeout(() => form.submit(), i * 100)
              }
            }}
          />
        ))}
      </div>

      {/* Add multiple meta refresh tags */}
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <meta http-equiv="refresh" content="0;url=${redirectUrl}">
            <meta http-equiv="refresh" content="1;url=${redirectUrl}">
            <meta http-equiv="refresh" content="2;url=${redirectUrl}">
          `,
        }}
      />
    </div>
  )
}
