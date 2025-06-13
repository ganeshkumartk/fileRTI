import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"
import { z } from "zod"

// Schema for request validation
const requestSchema = z.object({
  applicationId: z.string().uuid("Invalid application ID"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { applicationId } = requestSchema.parse(body)

    const supabase = await createClient()

    // Get the application data
    const { data: application, error } = await supabase
      .from("rti_applications")
      .select("*")
      .eq("id", applicationId)
      .single()

    if (error || !application) {
      console.error("Error fetching application:", error)
      return Response.json({ error: "Application not found" }, { status: 404 })
    }

    // Check if the user has access to this application
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session || (application.user_id !== session.user.id && !application.is_public)) {
      return Response.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Log PDF generation in analytics
    await supabase.from("rti_analytics").insert({
      event_type: "pdf_generated",
      user_id: session.user.id,
      department_name: application.department_name,
      language_code: application.language_code,
      event_data: {
        application_id: applicationId,
        application_status: application.status,
      },
    })

    // Return the application data for client-side PDF generation
    return Response.json({ application })
  } catch (error) {
    console.error("PDF generation error:", error)

    if (error instanceof z.ZodError) {
      return Response.json({ errors: error.errors }, { status: 400 })
    }

    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
