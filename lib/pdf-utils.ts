import QRCode from "qrcode"

export async function generateQRCode(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: "M",
      margin: 1,
      width: 120,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return ""
  }
}

export function createVerificationUrl(applicationId: string): string {
  // In production, this would be your actual domain
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || "https://rti-platform.vercel.app"
  return `${baseUrl}/verify/${applicationId}`
}
