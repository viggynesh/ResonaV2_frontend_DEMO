"use server"

export async function getVapiPublicKey() {
  return process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || ""
}
