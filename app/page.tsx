"use client"

import { useEffect, useState } from "react"
import { HeroSection } from "@/components/hero-section"
import Navigation from "@/components/navigation"
import RTIComposer from "@/components/rti-composer-new"
import GuestCTA from "@/components/guest-cta"
import Footer from "@/components/footer-new"
import { SetupGuide } from "@/components/setup-guide"
import { ExpertTemplates } from "@/components/expert-templates"

export default function HomePage() {
  const [isSupabaseConfigured, setIsSupabaseConfigured] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if Supabase environment variables are configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    setIsSupabaseConfigured(!!(supabaseUrl && supabaseKey))
  }, [])

  // Show loading state while checking configuration
  if (isSupabaseConfigured === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-light">Loading...</p>
        </div>
      </div>
    )
  }

  // Show setup guide if Supabase is not configured
  if (!isSupabaseConfigured) {
    return <SetupGuide />
  }

  // Show the main application if everything is configured
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30">
      <Navigation />
      <HeroSection />
      <RTIComposer />
      <ExpertTemplates />
      <GuestCTA />
      <Footer />
    </div>
  )
}
