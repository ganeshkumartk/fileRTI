"use client"

import { motion, useInView } from "framer-motion"
import { ArrowRight, CheckCircle, Clock, FileText, Shield, Zap, ArrowDown, Users, Award, TrendingUp, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"

interface ValuePropositionProps {
  icon: LucideIcon
  title: string
  description: string
  delay?: number
}

const ValueProposition = ({ icon: Icon, title, description, delay = 0 }: ValuePropositionProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 p-8 hover:shadow-lg transition-all duration-500 hover:scale-[1.02] hover:border-gray-200">
        <div className="absolute top-4 right-4 w-8 h-8 bg-black/5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ArrowRight className="w-4 h-4 text-gray-600" />
        </div>
        
        <div className="mb-6">
          <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mb-4 group-hover:bg-black/10 transition-colors duration-300">
            <Icon className="w-6 h-6 text-black/70" />
          </div>
          <h3 className="text-xl font-medium text-black mb-2 group-hover:text-black/80 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
          <span>Included</span>
        </div>
      </div>
    </motion.div>
  )
}

interface StatsCounterProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
}

const StatsCounter = ({ value, label, prefix = "", suffix = "" }: StatsCounterProps) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        const increment = value / 50
        const counter = setInterval(() => {
          setCount(prev => {
            if (prev >= value) {
              clearInterval(counter)
              return value
            }
            return Math.min(prev + increment, value)
          })
        }, 40)
        return () => clearInterval(counter)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isInView, value])

  return (
    <div ref={ref} className="inline-flex items-center gap-1 text-sm">
      <span className="font-medium text-black/70">
        {prefix}{Math.floor(count)}{suffix}
      </span>
      <span className="text-black/50">
        {label}
      </span>
    </div>
  )
}

export function HeroSection() {
  const [currentTime, setCurrentTime] = useState("")
  const [readyTime, setReadyTime] = useState("")

  const scrollToComposer = () => {
    document.getElementById("composer")?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date()
      const readyBy = new Date(now.getTime() + 3 * 60000) // Add 3 minutes
      
      const currentHours = now.getHours()
      const currentMinutes = now.getMinutes()
      const readyHours = readyBy.getHours()
      const readyMinutes = readyBy.getMinutes()
      
      // Convert to 12-hour format
      const formatTime = (hours: number, minutes: number) => {
        const ampm = hours >= 12 ? 'PM' : 'AM'
        const displayHours = hours % 12 || 12
        const displayMinutes = minutes.toString().padStart(2, '0')
        return `${displayHours}:${displayMinutes} ${ampm}`
      }
      
      setCurrentTime(formatTime(currentHours, currentMinutes))
      setReadyTime(formatTime(readyHours, readyMinutes))
    }

    updateTimes()
    const interval = setInterval(updateTimes, 60000)
    return () => clearInterval(interval)
  }, [])

  const valueProps = [
    {
      icon: Zap,
      title: "3-Minute Application",
      description: "Speak your requirement in any language. Our AI converts it into a professional RTI application instantly."
    },
    {
      icon: FileText,
      title: "Legal Compliance",
      description: "Every application follows RTI Act 2005 guidelines. Proper formatting, mandatory fields, and correct procedures."
    },
    {
      icon: Shield,
      title: "Proven Success",
      description: "94% success rate with government responses. Join hundreds who've received their information and justice."
    }
  ]

  return (
    <section className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center mt-12 px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-6xl mx-auto text-center">
            
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full text-sm text-black/70 mb-8 border border-black/10"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live • 247+ Applications processed in real-time</span>
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight text-black leading-[0.9] mb-6">
                Your Right to Know
                <br />
                <span className="text-black/60">Made Simple</span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-black/60 font-light max-w-3xl mx-auto leading-relaxed">
                Professional RTI applications in 3 minutes. Speak naturally, get legally compliant documents instantly.
              </p>
            </motion.div>

            {/* Time-based CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <div className="flex flex-col items-center justify-center mb-8">
                <Button
                  onClick={scrollToComposer}
                  size="lg"
                  className="bg-black text-white hover:bg-black/90 px-8 py-4 text-base font-medium rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group mb-4"
                >
                  <span>Start Your Application</span>
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <motion.div 
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [0.98, 1, 0.98]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-sm text-black/60 flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Ready by {readyTime} • No registration required</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Value Propositions */}
        <div className="px-4 sm:px-6 lg:px-8 pb-20">
          <div className="max-w-6xl mx-auto">
            
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-light text-black mb-4">
                What You Get
              </h2>
              <p className="text-black/60 text-lg max-w-2xl mx-auto">
                Everything you need to file successful RTI applications and get the transparency you deserve
              </p>
            </motion.div>

            {/* Value Props Grid */}
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {valueProps.map((prop, index) => (
                <ValueProposition
                  key={prop.title}
                  icon={prop.icon}
                  title={prop.title}
                  description={prop.description}
                  delay={index * 0.2}
                />
              ))}
            </div>

            {/* Final CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-center mt-16 pt-16 border-t border-black/10"
            >
              <div className="inline-flex items-center gap-2 text-black/50 mb-4">
                <ArrowDown className="w-4 h-4 animate-bounce" />
                <span className="text-sm">Start composing your RTI application below</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
