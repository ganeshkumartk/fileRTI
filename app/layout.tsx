import type React from "react"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"
import { ErrorBoundary } from "@/components/error-boundary"
import { ToastProvider } from "@/components/toast-provider"
import { cn } from "@/lib/utils"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
  preload: true,
})

export const metadata = {
  title: "RTI Platform - Professional Right to Information Applications",
  description:
    "Create professional RTI applications with AI assistance and voice input. Trusted by 10,000+ Indian citizens for transparent governance.",
  keywords: ["RTI", "Right to Information", "India", "Government", "Transparency", "AI", "Voice Input"],
  authors: [{ name: "RTI Platform" }],
  creator: "RTI Platform",
  publisher: "RTI Platform",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rti-platform.vercel.app",
    title: "RTI Platform - Professional Right to Information Applications",
    description: "Create professional RTI applications with AI assistance and voice input.",
    siteName: "RTI Platform",
  },
  twitter: {
    card: "summary_large_image",
    title: "RTI Platform - Professional Right to Information Applications",
    description: "Create professional RTI applications with AI assistance and voice input.",
  },
  verification: {
    // Add verification codes for search engines
    google: "your-google-verification-code",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(inter.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900 selection:bg-gray-900 selection:text-white">
        <ErrorBoundary>
          <Providers>
            {children}
            <ToastProvider />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
