"use client"

import dynamic from 'next/dynamic'
import { Mic } from 'lucide-react'
import { cn } from '@/lib/utils'

const VoiceInputDynamic = dynamic(
  () => import('./voice-input').then((mod) => ({ default: mod.VoiceInput })),
  {
    ssr: false,
    loading: () => (
      <button
        type="button"
        className={cn(
          "relative w-10 h-10 rounded-full transition-colors duration-200",
          "flex items-center justify-center",
          "bg-transparent text-gray-400 hover:bg-gray-100"
        )}
        disabled
        aria-label="Loading voice input"
      >
        <Mic className="h-5 w-5" />
      </button>
    ),
  }
)

interface VoiceInputWrapperProps {
  onTranscript: (text: string) => void
  language?: string
  className?: string
}

export function VoiceInputWrapper(props: VoiceInputWrapperProps) {
  return <VoiceInputDynamic {...props} />
} 