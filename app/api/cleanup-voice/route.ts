import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { voiceId } = await request.json()

    if (!voiceId) {
      return NextResponse.json({ error: "No voice ID provided" }, { status: 400 })
    }

    // Check if ElevenLabs API key exists
    if (!process.env.ELEVENLABS_API_KEY) {
      console.warn("ElevenLabs API key not configured, skipping voice cleanup")
      return NextResponse.json({ success: true, message: "No cleanup needed" })
    }

    // Handle API key - ElevenLabs keys start with sk_
    let elevenLabsApiKey: string
    const rawKey = process.env.ELEVENLABS_API_KEY

    if (rawKey.startsWith("sk_")) {
      elevenLabsApiKey = rawKey
    } else {
      try {
        elevenLabsApiKey = Buffer.from(rawKey, "base64").toString("utf-8")
      } catch (decodeError) {
        console.error("Failed to decode ElevenLabs API key:", decodeError)
        return NextResponse.json({ error: "API key decode error" }, { status: 500 })
      }
    }

    console.log("🗑️ Cleaning up voice:", voiceId)

    // Delete the voice from ElevenLabs
    const deleteResponse = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
      method: "DELETE",
      headers: {
        "xi-api-key": elevenLabsApiKey,
      },
    })

    console.log("📡 ElevenLabs delete response:", deleteResponse.status)

    if (deleteResponse.ok) {
      console.log("✅ Voice cleaned up successfully")
      return NextResponse.json({ success: true, message: "Voice cleaned up" })
    } else {
      console.warn("⚠️ Voice cleanup failed, but continuing")
      return NextResponse.json({ success: true, message: "Cleanup attempted" })
    }
  } catch (error) {
    console.error("❌ Voice cleanup error:", error)
    // Don't fail the request if cleanup fails
    return NextResponse.json({ success: true, message: "Cleanup attempted" })
  }
}
