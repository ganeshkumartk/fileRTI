"use client"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import type { Toast as ToastType } from "@/hooks/use-toast"

interface ToastProps {
  toast: ToastType
  onDismiss: (id: string) => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
  const { id, title, description, variant = "default" } = toast

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-lg border shadow-lg",
        "p-4 pr-8",
        variant === "default" && "bg-white border-gray-200",
        variant === "destructive" && "bg-red-50 border-red-200 text-red-800",
        variant === "success" && "bg-green-50 border-green-200 text-green-800",
      )}
    >
      <button
        onClick={() => onDismiss(id)}
        className={cn(
          "absolute right-2 top-2 rounded-md p-1",
          "text-gray-400 hover:text-gray-500",
          variant === "destructive" && "text-red-300 hover:text-red-400",
          variant === "success" && "text-green-300 hover:text-green-400",
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
      <div className="flex w-full items-start gap-3">
        <div className="flex-1">
          <div className="font-medium">{title}</div>
          {description && <div className="mt-1 text-sm text-gray-500">{description}</div>}
        </div>
      </div>
    </motion.div>
  )
}

interface ToastContainerProps {
  toasts: ToastType[]
  onDismiss: (id: string) => void
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-0 z-[100] flex flex-col items-end gap-2 px-4 py-6 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col-reverse sm:items-end sm:py-8 md:py-12">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}
