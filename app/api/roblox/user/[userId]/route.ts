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

  console.log(`👤 Fetching user data for ID: ${userId}`)

  try {
    const response = await fetchWithRetry(`https://users.roblox.com/v1/users/${userId}`, {})
    const data = await response.json()

    console.log("✅ User data fetched successfully:", data)

    return NextResponse.json({
      id: data.id,
      name: data.name,
      displayName: data.displayName,
      description: data.description,
      created: data.created,
      isBanned: data.isBanned,
      externalAppDisplayName: data.externalAppDisplayName,
      hasVerifiedBadge: data.hasVerifiedBadge,
      isDemo: false,
    })
  } catch (error) {
    console.error("❌ Failed to fetch user data:", error)
    return NextResponse.json(
      {
        error: "Unable to fetch user data. Please try again later.",
      },
      { status: 503 },
    )
  }
}
