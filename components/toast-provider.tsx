"use client"

import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "@/components/ui/toast"

export function ToastProvider() {
  const { toasts, dismiss } = useToast()

  return <ToastContainer toasts={toasts} onDismiss={dismiss} />
}
