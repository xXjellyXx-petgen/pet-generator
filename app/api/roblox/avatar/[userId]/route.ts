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

      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after")
        const waitTime = retryAfter ? Number.parseInt(retryAfter) * 1000 : (i + 1) * 2000
        console.log(`Rate limited, waiting ${waitTime}ms before retry ${i + 1}`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    } catch (error) {
      console.log(`Attempt ${i + 1} failed:`, error)

      if (i === maxRetries - 1) {
        throw error
      }

      const waitTime = Math.pow(2, i) * 1000
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  throw new Error("Max retries exceeded")
}

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  const userId = params.userId

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  console.log(`🖼️ Fetching avatar for user ID: ${userId}`)

  try {
    // Try multiple avatar endpoints
    const endpoints = [
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`,
      `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=150x150&format=Png&isCircular=false`,
      `https://thumbnails.roblox.com/v1/users/avatar-bust?userIds=${userId}&size=150x150&format=Png&isCircular=false`,
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`📡 Trying avatar endpoint: ${endpoint}`)
        const response = await fetchWithRetry(endpoint, {})
        const data = await response.json()

        console.log("🖼️ Avatar response:", data)

        if (data.data && data.data.length > 0 && data.data[0].imageUrl) {
          return NextResponse.json({
            success: true,
            data: data.data,
          })
        }
      } catch (endpointError) {
        console.log(`⚠️ Avatar endpoint failed: ${endpoint}`)
        continue
      }
    }

    // If all endpoints fail, return empty data to trigger placeholder
    console.log("⚠️ All avatar endpoints failed, using placeholder")
    return NextResponse.json({
      success: false,
      data: [],
    })
  } catch (error) {
    console.error("❌ Avatar fetch error:", error)
    return NextResponse.json({
      success: false,
      data: [],
    })
  }
}
