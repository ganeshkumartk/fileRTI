"use client"

import { useVoiceInput } from "@/hooks/use-voice-input"
import { motion } from "framer-motion"
import { Mic } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  language?: string
  className?: string
}

export function VoiceInput({ onTranscript, language = "en-US", className }: VoiceInputProps) {
  const { isListening, start, stop, isSupported } = useVoiceInput({
    onResult: onTranscript,
    language,
  })

  if (!isSupported) {
    return null
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.95 }}
      onClick={isListening ? stop : start}
      className={cn(
        "relative w-10 h-10 rounded-full transition-colors duration-200",
        "flex items-center justify-center",
        isListening
          ? "bg-gray-900 text-white hover:bg-gray-800"
          : "bg-transparent text-gray-400 hover:bg-gray-100",
        className
      )}
      aria-label={isListening ? "Stop listening" : "Start listening"}
    >
      {isListening && (
        <motion.div
          className="absolute inset-0 rounded-full bg-gray-700"
          initial={{ scale: 0.5, opacity: 0.7 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop",
          }}
        />
      )}
      <Mic className="relative z-10 h-5 w-5" />
    </motion.button>
  )
}
