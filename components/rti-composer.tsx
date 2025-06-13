"use client"

import { useState, useEffect, useCallback } from "react"
import { VoiceInput } from "@/components/voice-input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRTIStore } from "@/stores/rti-store"
import { useAuth } from "@/hooks/use-auth"
import { Sparkles, Building2, FileText, Mic } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RTIEditor } from "@/components/rti-editor"
import { debounce } from 'lodash'

interface Department {
  id: string
  name: string
  code: string
  description: string
}

export function RTIComposer() {
  const { draft, updateDraft, saveDraft } = useRTIStore()
  const { profile, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [departments, setDepartments] = useState<Department[]>([])
  const [loadingDepartments, setLoadingDepartments] = useState(true)

  // Fetch departments from database
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/rti/departments")
        const data = await response.json()
        setDepartments(data.departments || [])
      } catch (error) {
        console.error("Failed to fetch departments:", error)
        setDepartments([
          { id: "1", name: "Ministry of Electronics and Information Technology", code: "MEITY", description: "" },
          { id: "2", name: "Ministry of Finance", code: "MOF", description: "" },
          { id: "3", name: "Ministry of Education", code: "MOE", description: "" },
          { id: "4", name: "Ministry of Health and Family Welfare", code: "MOHFW", description: "" },
          { id: "5", name: "Ministry of Railways", code: "MOR", description: "" },
        ])
      } finally {
        setLoadingDepartments(false)
      }
    }

    fetchDepartments()
  }, [])

  // Auto-save draft
  const debouncedSave = useCallback(
    debounce(async () => {
      if (!isAuthenticated || !profile) return
      try {
        await saveDraft(profile)
      } catch (error) {
        console.error('Error auto-saving draft:', error)
      }
    }, 2000),
    [isAuthenticated, profile, saveDraft],
  )

  useEffect(() => {
    if (draft.query.trim()) {
      debouncedSave()
    }
    return () => {
      debouncedSave.cancel()
    }
  }, [draft.query, debouncedSave])

  const handleVoiceTranscript = (text: string) => {
    updateDraft({ query: draft.query + " " + text })
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/50 overflow-hidden">
      {/* Header */}
      <div className="px-10 py-8 border-b border-neutral-100/80">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light tracking-tight text-neutral-900">Your RTI Application</h2>
          <div className="flex items-center gap-3 text-sm font-light text-neutral-600 bg-neutral-50 px-4 py-2 rounded-full border border-neutral-200/50">
            <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></div>
            Auto-saved
          </div>
        </div>
      </div>

      <div className="p-10 space-y-12">
        {/* What information do you need? */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-neutral-100 rounded-2xl">
              <Sparkles className="w-5 h-5 text-neutral-600" />
            </div>
            <h3 className="text-lg font-light tracking-tight text-neutral-900">What information do you need?</h3>
          </div>
          
          <div className="relative">
            <Textarea
              placeholder="Describe the specific government information you're seeking..."
              value={draft.query}
              onChange={(e) => updateDraft({ query: e.target.value })}
              className="min-h-[120px] resize-none border-neutral-200/60 focus:border-neutral-400 focus:ring-0 text-neutral-700 placeholder:text-neutral-400 font-light tracking-wide rounded-2xl px-6 py-4 bg-neutral-50/30"
            />
            <div className="absolute bottom-4 right-4">
              <Button
                size="sm"
                variant="ghost"
                className="h-10 w-10 p-0 hover:bg-neutral-100 rounded-xl"
              >
                <Mic className="h-4 w-4 text-neutral-500" />
              </Button>
            </div>
          </div>
        </div>

        {/* Government Department */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-neutral-100 rounded-2xl">
              <Building2 className="w-5 h-5 text-neutral-600" />
            </div>
            <h3 className="text-lg font-light tracking-tight text-neutral-900">Government Department</h3>
          </div>
          
          <Select
            value={draft.department}
            onValueChange={(value) => updateDraft({ department: value })}
            disabled={loadingDepartments}
          >
            <SelectTrigger className="border-neutral-200/60 focus:border-neutral-400 focus:ring-0 rounded-2xl px-6 py-4 h-auto bg-neutral-50/30 font-light">
              <SelectValue 
                placeholder={loadingDepartments ? "Loading departments..." : "Select the relevant department"} 
                className="text-neutral-700"
              />
            </SelectTrigger>
            <SelectContent className="border-neutral-200/60 rounded-2xl shadow-lg">
              {departments.map((dept) => (
                <SelectItem 
                  key={dept.id} 
                  value={dept.name}
                  className="font-light text-neutral-700 focus:bg-neutral-50"
                >
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* RTI Application Content */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 bg-neutral-100 rounded-2xl">
              <FileText className="w-5 h-5 text-neutral-600" />
            </div>
            <h3 className="text-lg font-light tracking-tight text-neutral-900">RTI Application Content</h3>
          </div>
          
          <div className="border border-neutral-200/60 rounded-2xl overflow-hidden bg-neutral-50/30">
            <RTIEditor
              content={draft.query}
              onChange={(newContent: string) => {
                updateDraft({ query: newContent })
              }}
              placeholder="Your RTI application content will appear here..."
            />
          </div>
          
          <div className="flex items-center justify-between text-sm font-light text-neutral-500">
            <span>0 words • 0 characters</span>
          </div>
        </div>
      </div>
    </div>
  )
}
