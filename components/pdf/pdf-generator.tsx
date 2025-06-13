"use client"

import { useState } from "react"
import { pdf } from "@react-pdf/renderer"
import { RTIDocument } from "./rti-document"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { generateQRCode, createVerificationUrl } from "@/lib/pdf-utils"

interface PDFGeneratorProps {
  applicationId: string
  onError?: (error: Error) => void
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

// Native browser download function
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function PDFGenerator({
  applicationId,
  onError,
  className,
  variant = "outline",
  size = "sm",
}: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = async () => {
    try {
      setIsGenerating(true)

      // Validate application ID
      if (!applicationId || applicationId === "draft") {
        throw new Error("Invalid application ID")
      }

      // Fetch application data from API
      const response = await fetch("/api/rti/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate PDF")
      }

      const { application } = await response.json()

      // Generate QR code for verification
      const verificationUrl = createVerificationUrl(applicationId)
      const qrCodeDataUrl = await generateQRCode(verificationUrl)

      // Generate PDF
      const doc = <RTIDocument application={application} qrCodeDataUrl={qrCodeDataUrl} />
      const asPdf = pdf()
      asPdf.updateContainer(doc)
      const blob = await asPdf.toBlob()

      // Generate filename
      const filename = application.application_number
        ? `RTI-${application.application_number}.pdf`
        : `RTI-Application-${new Date().toISOString().split("T")[0]}.pdf`

      // Download file using native browser API
      downloadBlob(blob, filename)
    } catch (error) {
      console.error("Error generating PDF:", error)
      if (onError && error instanceof Error) {
        onError(error)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button variant={variant} size={size} onClick={generatePDF} disabled={isGenerating} className={className}>
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </>
      )}
    </Button>
  )
}
