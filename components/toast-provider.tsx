"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider as RadixToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function ToastProvider() {
  const { toasts } = useToast()

  return (
    <RadixToastProvider>
      {toasts.map(function ({ id, title, description, variant, ...props }) {
        // Map success variant to default since Radix only supports default/destructive
        const mappedVariant = variant === "success" ? "default" : variant;
        
        return (
          <Toast key={id} variant={mappedVariant} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </RadixToastProvider>
  )
}
