"use client"

import React from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service (e.g., Sentry)
    console.error("Error caught by boundary:", error, errorInfo)

    // In production, send to error tracking service
    if (process.env.NODE_ENV === "production") {
      // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            <h1 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              We apologize for the inconvenience. Our team has been notified and is working on a fix.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-900 text-white hover:bg-gray-800"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>

              <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
                Go to Homepage
              </Button>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer">Error Details (Development)</summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
