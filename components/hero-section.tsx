"use client"

import { motion } from "framer-motion"
import { ArrowRight, Shield, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  const scrollToComposer = () => {
    document.getElementById("rti-composer")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] [background-size:24px_24px]" />

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-600 mb-8 border border-gray-100"
          >
            <Shield className="h-4 w-4" />
            Trusted by 10,000+ Citizens
          </motion.div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-light tracking-tight mb-8 leading-[0.9]">
            <span className="font-medium text-gray-900">Your Questions</span>
            <br />
            <span className="text-gray-500">Their Answers</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            Professional RTI applications in minutes, not hours.
            <br className="hidden md:block" />
            Voice-powered, AI-assisted, legally compliant.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              onClick={scrollToComposer}
              size="lg"
              className="bg-gray-900 text-white hover:bg-gray-800 px-8 py-4 text-base font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Start Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="text-gray-600 hover:bg-gray-900 hover:text-gray-50 px-8 py-4 text-base font-medium"
            >
              View Sample
            </Button>
          </motion.div>
        </motion.div>

        {/* Premium feature indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto"
        >
          <div className="text-center group">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-100 transition-colors">
              <Zap className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Voice Input</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Speak naturally in any Indian language</p>
          </div>

          <div className="text-center group">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-100 transition-colors">
              <Shield className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Legal Compliance</h3>
            <p className="text-sm text-gray-600 leading-relaxed">RTI Act 2005 compliant formatting</p>
          </div>

          <div className="text-center group">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-100 transition-colors">
              <Globe className="h-6 w-6 text-gray-700" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Multi-language</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Generate in 6+ regional languages</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
