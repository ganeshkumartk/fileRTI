"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, AlertCircle } from "lucide-react"
import type { RTIApplication } from "@/types/database"

interface PDFPreviewProps {
  application: RTIApplication
  height?: string | number
}

export function PDFPreview({ application, height = 600 }: PDFPreviewProps) {
  const [isClient, setIsClient] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <Skeleton className="w-full" style={{ height }} />
  }

  // For now, show a simple preview instead of the PDF viewer to avoid compatibility issues
  return (
    <div className="w-full border border-gray-200 rounded-lg bg-white" style={{ height }}>
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">PDF Preview</h3>
            <p className="text-sm text-gray-600">RTI Application Document</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4 overflow-y-auto" style={{ height: `calc(${height}px - 100px)` }}>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Application Details</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Reference:</span> {application.application_number || "Draft"}
            </p>
            <p>
              <span className="font-medium">Department:</span> {application.department_name}
            </p>
            <p>
              <span className="font-medium">Status:</span> {application.status}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Subject</h4>
          <p className="text-sm text-gray-700">
            {application.subject || "Application under Right to Information Act, 2005"}
          </p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Content</h4>
          <div className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded border max-h-64 overflow-y-auto">
            {application.content}
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">PDF Generation Available</p>
              <p className="text-sm text-blue-700 mt-1">
                Click "Export PDF" to generate a professionally formatted document ready for submission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
