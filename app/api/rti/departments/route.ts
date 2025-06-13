import { supabaseAdmin } from "@/lib/supabase/admin"
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from("departments")
      .select("id, name, code, description")
      .eq("is_active", true)
      .order("name")

    if (error) {
      console.error("Error fetching departments:", error)
      return Response.json({ error: "Failed to fetch departments" }, { status: 500 })
    }

    return Response.json({ departments: data || [] })
  } catch (error) {
    console.error("API error:", error)
    return Response.json({ departments: [], error: "Internal server error" }, { status: 500 })
  }
}
