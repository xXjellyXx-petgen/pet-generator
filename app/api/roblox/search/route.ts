import { type NextRequest, NextResponse } from "next/server"

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept: "application/json",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          ...options.headers,
        },
      })

      if (response.ok) {
        return response
      }

      // If we get a 429 (rate limit), wait before retrying
      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after")
        const waitTime = retryAfter ? Number.parseInt(retryAfter) * 1000 : (i + 1) * 2000
        console.log(`Rate limited, waiting ${waitTime}ms before retry ${i + 1}`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      // For other errors, throw to trigger retry
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    } catch (error) {
      console.log(`Attempt ${i + 1} failed:`, error)

      if (i === maxRetries - 1) {
        throw error
      }

      // Wait before retrying (exponential backoff)
      const waitTime = Math.pow(2, i) * 1000
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  throw new Error("Max retries exceeded")
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 })
  }

  console.log(`🔍 Searching for user: ${username}`)

  try {
    // Method 1: Try the search endpoint
    try {
      console.log("📡 Trying search endpoint...")
      const response = await fetchWithRetry(
        `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(username)}&limit=10`,
        {},
      )

      const data = await response.json()
      console.log("✅ Search endpoint successful:", data)

      if (data.data && data.data.length > 0) {
        return NextResponse.json({
          data: data.data,
          isDemo: false,
        })
      }
    } catch (searchError) {
      console.log("⚠️ Search endpoint failed, trying alternative method...")
    }

    // Method 2: Try the usernames endpoint (alternative)
    try {
      console.log("📡 Trying usernames endpoint...")
      const response = await fetchWithRetry(`https://users.roblox.com/v1/usernames/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usernames: [username],
          excludeBannedUsers: true,
        }),
      })

      const data = await response.json()
      console.log("✅ Usernames endpoint successful:", data)

      if (data.data && data.data.length > 0) {
        return NextResponse.json({
          data: data.data,
          isDemo: false,
        })
      }
    } catch (usernamesError) {
      console.log("⚠️ Usernames endpoint failed...")
    }

    // If both methods fail, return user not found
    return NextResponse.json(
      {
        error: "User not found. Please check the username and try again.",
      },
      { status: 404 },
    )
  } catch (error) {
    console.error("❌ All search methods failed:", error)
    return NextResponse.json(
      {
        error: "Unable to connect to Roblox services. Please try again later.",
      },
      { status: 503 },
    )
  }
}
