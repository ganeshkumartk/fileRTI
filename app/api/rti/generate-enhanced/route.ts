import type { NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { generateRTIWithStructuredOutput } from "@/lib/ai/gemini-client"

const enhancedRequestSchema = z.object({
  query: z.string().min(10, "Query must be at least 10 characters"),
  department: z.string().min(1, "Department is required"),
  applicantDetails: z.object({
    name: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional().refine((email) => !email || z.string().email().safeParse(email).success, {
      message: "Must be a valid email address"
    }),
  }).optional(),
  options: z.object({
    tone: z.enum(["formal", "urgent", "followup"]).default("formal"),
    useThinking: z.boolean().default(false),
    structuredOutput: z.boolean().default(true),
    urgency: z.enum(["low", "medium", "high"]).default("medium"),
    context: z.string().optional(),
    previousApplicationId: z.string().optional(),
    legalGrounds: z.array(z.string()).optional(),
    specificSections: z.array(z.string()).optional()
  }).default({})
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query, department, applicantDetails, options } = enhancedRequestSchema.parse(body)

    const supabase = await createClient()
    
    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    let userId = session?.user?.id

    // If no user session exists, create an anonymous user
    if (!userId) {
      console.log('No user session found, creating anonymous user...')
      try {
        const { data: { user }, error: authError } = await supabase.auth.signInAnonymously()
        
        if (authError || !user) {
          console.error('Failed to create anonymous user:', authError)
          return Response.json({ error: "Authentication failed" }, { status: 401 })
        }
        
        userId = user.id
        console.log('Anonymous user created successfully:', { userId })
      } catch (error) {
        console.error('Error creating anonymous user:', error)
        return Response.json({ error: "Authentication failed" }, { status: 401 })
      }
    } else {
      console.log('Using existing user session:', { userId })
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

    // Generate RTI with Gemini structured output
    const result = await generateRTIWithStructuredOutput({
      query,
      department,
      applicantDetails,
      tone: options.tone,
      useThinking: options.useThinking,
      context: options.context
    })

    // Generate a unique application number
    const applicationNumber = `RTI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const insertData = {
      user_id: userId,
      application_number: applicationNumber,
      department_id: departmentId,
      department_name: department,
      subject: (result.structured as any)?.subject || "Application under Right to Information Act, 2005",
      content: result.formatted || "Generated RTI content",
      status: "draft",
      language_code: "en",
      applicant_details: applicantDetails || {},
      metadata: {
        structured_content: result.structured,
        generation_options: options,
        thinking_process: result.thinking,
        ai_model: "gemini-2.0-flash",
        generation_timestamp: new Date().toISOString(),
        to_section: (result.structured as any)?.to_section,
        content_justification: (result.structured as any)?.content_justification,
        legal_references: (result.structured as any)?.legal_references,
        declaration: (result.structured as any)?.declaration
      }
    }

    console.log('Attempting to insert data:', JSON.stringify(insertData, null, 2));

    // Save to database with enhanced metadata
    const { data: application, error: saveError } = await supabaseAdmin
      .from("rti_applications")
      .insert(insertData)
      .select()
      .single()

    if (saveError) {
      console.error("Database save error details:", {
        error: saveError,
        message: saveError.message,
        details: saveError.details,
        hint: saveError.hint,
        code: saveError.code
      })
      console.error("Full saveError object:", JSON.stringify(saveError, null, 2))
      return Response.json({ 
        error: "Failed to save application", 
        details: saveError.message || "Unknown database error",
        code: saveError.code 
      }, { status: 500 })
    }

    console.log('Successfully saved application:', application?.id);

    // Log enhanced analytics
    const { error: analyticsError } = await supabaseAdmin.from("rti_analytics").insert({
      event_type: "enhanced_rti_generated",
      user_id: userId,
      department_name: department,
      language_code: "en",
      event_data: {
        query_length: query.length,
        used_structured_output: options.structuredOutput,
        used_thinking: options.useThinking,
        tone: options.tone,
        urgency: options.urgency,
        application_id: application.id,
        content_score: (result.structured as any)?.formatting?.structure === "detailed" ? 100 : 80
      }
    })

    if (analyticsError) {
      console.error("Error logging analytics:", analyticsError)
    }

    return Response.json({
      success: true,
      draft: result.formatted,
      applicationId: application.id,
      content: {
        formatted: result.formatted,
        structured: result.structured,
        thinking: result.thinking
      },
      metadata: {
        model: "gemini-2.0-flash",
        structuredOutput: true,
        generatedAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error("Enhanced RTI generation error:", error)
    
    if (error instanceof z.ZodError) {
      return Response.json({ 
        error: "Validation failed", 
        errors: error.errors 
      }, { status: 400 })
    }

    return Response.json({ 
      error: "Failed to generate RTI application"
    }, { status: 500 })
  }
} 