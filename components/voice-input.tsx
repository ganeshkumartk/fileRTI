"use client"

import { useVoiceInput } from "@/hooks/use-voice-input"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  language?: string
  className?: string
}

export function VoiceInput({ onTranscript, language = "hi-IN", className }: VoiceInputProps) {
  const { isListening, start, stop, transcript, error, isSupported } = useVoiceInput({
    onResult: onTranscript,
    language,
  })

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <AlertCircle className="h-4 w-4" />
        Voice input not supported in this browser
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={isListening ? stop : start}
        className={cn(
          "relative w-20 h-20 rounded-full transition-all duration-200",
          "border-2 flex items-center justify-center",
          isListening
            ? "bg-red-50 border-red-200 text-red-600"
            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100",
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isListening ? "listening" : "idle"}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </motion.div>
        </AnimatePresence>

        {/* Subtle pulse when listening */}
        {isListening && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-red-200"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />
        )}
      </motion.button>

      <div className="text-center max-w-xs">
        <p className="text-sm font-medium text-gray-900 mb-1">{isListening ? "Listening..." : "Tap to speak"}</p>
        <p className="text-xs text-gray-500">
          {isListening ? "Speak clearly and we'll add it to your query" : "Voice input in Hindi or English"}
        </p>

        {transcript && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-gray-600 mt-3 p-2 bg-gray-50 rounded border italic"
          >
            &quot;{transcript}&quot;
          </motion.p>
        )}

        {error && (
          <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-600 mt-3">
            Error: {error}
          </motion.p>
        )}
      </div>
    </div>
  )
}
