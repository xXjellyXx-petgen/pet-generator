export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { webhookUrl, profileData } = body

    if (!webhookUrl || !profileData) {
      return Response.json({ error: "Missing webhook URL or profile data" }, { status: 400 })
    }

    // Validate webhook URL format
    if (!webhookUrl.includes("discord.com/api/webhooks/") || webhookUrl === "YOUR_DISCORD_WEBHOOK_URL_HERE") {
      console.log("⚠️ Invalid or placeholder webhook URL, skipping...")
      return Response.json({ success: false, message: "Webhook URL not configured" })
    }

    console.log("📡 Sending profile to webhook:", profileData.name)

    // Send to webhook with proper Discord formatting
    const webhookPayload = {
      embeds: [
        {
          title: "🎮 New Roblox Profile Connected",
          color: 65280, // Green color in decimal
          fields: [
            {
              name: "👤 Username",
              value: `@${profileData.name}`,
              inline: true,
            },
            {
              name: "🏷️ Display Name",
              value: profileData.displayName || profileData.name,
              inline: true,
            },
            {
              name: "🆔 User ID",
              value: profileData.id.toString(),
              inline: true,
            },
            {
              name: "📅 Account Created",
              value: new Date(profileData.created).toLocaleDateString(),
              inline: true,
            },
            {
              name: "✅ Verified Badge",
              value: profileData.hasVerifiedBadge ? "Yes" : "No",
              inline: true,
            },
            {
              name: "🎭 Profile Type",
              value: profileData.isDemo ? "Demo Mode" : "Live Profile",
              inline: true,
            },
          ],
          description: profileData.description || "No description available",
          thumbnail: {
            url:
              profileData.avatar && !profileData.avatar.includes("placeholder.svg")
                ? profileData.avatar
                : "https://via.placeholder.com/100x100?text=Avatar",
          },
          timestamp: new Date().toISOString(),
          footer: {
            text: "Pet & Seed Store - Profile Connection",
          },
        },
      ],
    }

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(webhookPayload),
    })

    if (!webhookResponse.ok) {
      const errorText = await webhookResponse.text()
      console.error("❌ Profile webhook failed:", webhookResponse.status, errorText)

      // Handle specific Discord errors
      if (webhookResponse.status === 404) {
        console.error("❌ Webhook not found - URL may be invalid or expired")
        return Response.json({
          success: false,
          error: "Webhook not found",
          message: "The Discord webhook URL is invalid or has been deleted",
        })
      }

      if (webhookResponse.status === 401) {
        console.error("❌ Webhook unauthorized")
        return Response.json({
          success: false,
          error: "Webhook unauthorized",
          message: "Invalid webhook permissions",
        })
      }

      // Try a simpler payload if the complex one fails
      try {
        const simplePayload = {
          content: `🎮 **Profile Connected:** @${profileData.name} (ID: ${profileData.id})`,
        }

        const retryResponse = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(simplePayload),
        })

        if (!retryResponse.ok) {
          throw new Error(`Retry also failed: ${retryResponse.status}`)
        }

        console.log("✅ Simple profile webhook sent successfully")
        return Response.json({ success: true, method: "simple" })
      } catch (retryError) {
        console.error("❌ Retry webhook also failed:", retryError)
        return Response.json({
          success: false,
          error: "Webhook failed",
          details: errorText,
        })
      }
    }

    console.log("✅ Profile sent to webhook successfully")
    return Response.json({ success: true, method: "embed" })
  } catch (error) {
    console.error("❌ Profile webhook error:", error)
    return Response.json(
      {
        success: false,
        error: "Failed to send webhook",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
