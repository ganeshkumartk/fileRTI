import type { NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const requestSchema = z.object({
  query: z.string().min(10, "Query must be at least 10 characters"),
  department: z.string().min(1, "Department is required"),
  language: z.string().default("en"),
  templateId: z.string().uuid().optional(),
  applicantDetails: z
    .object({
      name: z.string().optional(),
      address: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional(),
      pan: z.string().optional(),
    })
    .optional(),
  subject: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, department, language, templateId, applicantDetails, subject } = requestSchema.parse(body)

    const supabase = await createClient()

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const userId = session?.user?.id

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get department ID if available
    let departmentId = null
    if (department) {
      const { data: deptData } = await supabase
        .from("departments")
        .select("id")
        .eq("name", department)
        .limit(1)
        .single()

      if (deptData) {
        departmentId = deptData.id
      }
    }

    // Generate RTI content
    const rtiDraft = generateRTIContent(query, department)

    // Save as draft in database - let Supabase generate the UUID
    const { data: application, error: saveError } = await supabase
      .from("rti_applications")
      .insert({
        // Remove the manual ID generation and let Supabase handle it
        user_id: userId,
        department_id: departmentId,
        department_name: department,
        subject: subject || "Application under Right to Information Act, 2005",
        content: rtiDraft,
        status: "draft",
        language_code: language,
        template_id: templateId,
        applicant_details: applicantDetails || {},
      })
      .select()
      .single()

    if (saveError) {
      console.error("Error saving application:", saveError)
      return Response.json({ error: "Failed to save application" }, { status: 500 })
    }

    // Increment template usage if template was used
    if (templateId) {
      const { error: usageError } = await supabase.rpc("increment_template_usage", {
        template_id: templateId,
      })
      if (usageError) {
        console.error("Error incrementing template usage:", usageError)
      }
    }

    // Log analytics
    const { error: analyticsError } = await supabase.from("rti_analytics").insert({
      event_type: "rti_generated",
      user_id: userId,
      department_name: department,
      language_code: language,
      event_data: {
        query_length: query.length,
        used_template: !!templateId,
        template_id: templateId,
        application_id: application.id,
      },
    })

    if (analyticsError) {
      console.error("Error logging analytics:", analyticsError)
    }

    return Response.json({
      draft: rtiDraft,
      applicationId: application.id,
    })
  } catch (error) {
    console.error("RTI generation error:", error)

    if (error instanceof z.ZodError) {
      return Response.json({ errors: error.errors }, { status: 400 })
    }

    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateRTIContent(query: string, department: string): string {
  const currentDate = new Date().toLocaleDateString("en-IN")

  return `To,
The Public Information Officer,
${department}

Subject: Application under Right to Information Act, 2005

Sir/Madam,

I am writing to request information under the Right to Information Act, 2005. I would like to obtain the following information:

${query}

I am a citizen of India and am entitled to this information under Section 3 of the RTI Act, 2005. Please provide the requested information within the stipulated time frame of 30 days as per Section 7(1) of the Act.

If any fees are required for processing this application, please inform me in advance. I am willing to pay the prescribed fees as per the RTI rules.

If the information sought is not available with your office, please transfer this application to the concerned department under Section 6(3) of the RTI Act and inform me accordingly.

I look forward to your prompt response.

Thanking you,

[Your Name]
[Your Address]
[Phone Number]
[Email Address]

Date: ${currentDate}`
}
