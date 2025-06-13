import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import { CheckCircle, AlertCircle, FileText } from "lucide-react"

export default async function VerifyPage({ params }: { params: { id: string } }) {
  const { id } = params
  const supabase = await createClient()

  const { data: application, error } = await supabase
    .from("rti_applications")
    .select("*, responses:rti_responses(*)")
    .eq("id", id)
    .eq("is_public", true)
    .single()

  if (error || !application) {
    notFound()
  }

  // Log verification view
  await supabase.from("rti_analytics").insert({
    event_type: "application_verified",
    department_name: application.department_name,
    event_data: {
      application_id: id,
      application_status: application.status,
    },
  })

  const isSubmitted = application.status !== "draft"
  const hasResponse = application.responses && application.responses.length > 0

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-900 text-white p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-medium">RTI Application Verification</h1>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm">
                <FileText className="h-4 w-4" />
                {application.application_number || "Draft"}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {isSubmitted ? (
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {isSubmitted ? "Verified Application" : "Draft Application"}
                </h2>
                <p className="text-sm text-gray-600">
                  {isSubmitted
                    ? "This is an authentic RTI application submitted through RTI Platform"
                    : "This application has not been officially submitted yet"}
                </p>
              </div>
            </div>
          </div>

          {/* Application Details */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Application Details</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-500">Status:</span>{" "}
                    <span className="font-medium capitalize">{application.status}</span>
                  </p>
                  <p>
                    <span className="text-gray-500">Created:</span> <span>{formatDate(application.created_at)}</span>
                  </p>
                  {application.submitted_at && (
                    <p>
                      <span className="text-gray-500">Submitted:</span>{" "}
                      <span>{formatDate(application.submitted_at)}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Department</h3>
                <p className="text-sm">{application.department_name}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Subject</h3>
              <p className="text-gray-700">
                {application.subject || "Application under Right to Information Act, 2005"}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Content</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-gray-700 whitespace-pre-wrap">{application.content}</p>
              </div>
            </div>

            {hasResponse && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Responses</h3>
                <div className="space-y-4">
                  {application.responses.map((response: any) => (
                    <div key={response.id} className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-blue-800 capitalize">{response.response_type}</span>
                        <span className="text-xs text-blue-600">{formatDate(response.responded_at)}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{response.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 p-6 text-center text-sm text-gray-500">
            <p>
              This verification page confirms the authenticity of the RTI application.
              <br />
              For more information, visit{" "}
              <a href="/" className="text-blue-600 hover:underline">
                RTI Platform
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
