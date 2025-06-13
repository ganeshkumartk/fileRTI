import { supabaseAdmin } from "@/lib/supabase/admin"
import type { NextRequest } from "next/server"

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const category = url.searchParams.get("category")
    const language = url.searchParams.get("language") || "en"
    const search = url.searchParams.get("search")

    // Create cache key
    const cacheKey = `templates:${language}:${category || "all"}:${search || "none"}`

    // Check cache first
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return Response.json({ templates: cached.data })
    }

    // Build query
    let query = supabaseAdmin
      .from("rti_templates")
      .select("id, title, description, category, template_content, tags, usage_count")
      .eq("is_active", true)
      .eq("language_code", language)
      .order("is_featured", { ascending: false })
      .order("usage_count", { ascending: false })
      .limit(50)

    // Apply filters
    if (category) {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Database error:", error)
      return Response.json({ error: "Failed to fetch templates" }, { status: 500 })
    }

    const templates = data || []

    // Cache the result
    cache.set(cacheKey, { data: templates, timestamp: Date.now() })

    // Clean old cache entries
    if (cache.size > 100) {
      const now = Date.now()
      for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          cache.delete(key)
        }
      }
    }

    return Response.json(
      { templates },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      },
    )
  } catch (error) {
    console.error("API error:", error)
    return Response.json({ templates: [], error: "Internal server error" }, { status: 500 })
  }
}
