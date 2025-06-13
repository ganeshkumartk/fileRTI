"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Database, Key, CheckCircle } from "lucide-react"

export function SetupGuide() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12">
      <div className="max-w-4xl mx-auto px-8">
        <Card className="border-neutral-200/60 shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-16">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Database className="w-8 h-8 text-neutral-600" />
              </div>
              <h1 className="text-5xl font-light tracking-tight text-neutral-900 mb-4">Setup Required</h1>
              <p className="text-xl font-light text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                Configure your environment to unlock the full RTI platform experience
              </p>
            </div>

            {/* Setup Steps */}
            <div className="space-y-8 mb-16">
              <div className="flex gap-6 p-8 bg-neutral-50 rounded-2xl border border-neutral-200/50">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center">
                    <Key className="w-5 h-5 text-neutral-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-light tracking-tight text-neutral-900 mb-3">Environment Variables</h3>
                  <p className="text-neutral-600 font-light mb-6 leading-relaxed">
                    Add your Supabase credentials to your environment configuration:
                  </p>
                  <div className="bg-neutral-900 rounded-2xl p-6 font-mono text-sm overflow-x-auto">
                    <div className="text-neutral-400 mb-1"># .env.local</div>
                    <div className="text-neutral-200">NEXT_PUBLIC_SUPABASE_URL=your_supabase_url</div>
                    <div className="text-neutral-200">NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key</div>
                    <div className="text-neutral-200">SUPABASE_SERVICE_ROLE_KEY=your_service_role_key</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 p-8 bg-neutral-50 rounded-2xl border border-neutral-200/50">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center">
                    <Database className="w-5 h-5 text-neutral-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-light tracking-tight text-neutral-900 mb-3">Database Setup</h3>
                  <p className="text-neutral-600 font-light mb-6 leading-relaxed">
                    Run the database setup script in your Supabase SQL editor:
                  </p>
                  <Button 
                    variant="ghost" 
                    className="border border-neutral-300 hover:border-neutral-400 rounded-2xl font-light text-neutral-700 hover:text-neutral-900 transition-all duration-300"
                    onClick={() => window.open('/scripts/setup-database.sql', '_blank')}
                  >
                    View Setup Script
                  </Button>
                </div>
              </div>
            </div>

            {/* Status Check */}
            <div className="text-center bg-amber-50 border border-amber-200/60 rounded-2xl p-8">
              <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-4" />
              <h3 className="text-lg font-light tracking-tight text-amber-900 mb-2">Configuration Incomplete</h3>
              <p className="text-amber-700 font-light">
                Please complete the setup steps above and restart your development server.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
