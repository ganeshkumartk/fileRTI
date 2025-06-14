"use client"

import { HeroSection, Navigation, GuestCTA, Footer } from "@/components/core"
import { RTIComposer, ExpertTemplates } from "@/components/rti"

export default function HomePage() {
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
