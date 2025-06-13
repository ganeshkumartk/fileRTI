"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRTIStore } from "@/stores/rti-store"
import { 
  FileText, 
  User, 
  FileSignature, 
  Download, 
  Share2, 
  Globe
} from "lucide-react"

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "bn", name: "বাংলা" },
  { code: "te", name: "తెలుగు" },
  { code: "mr", name: "मराठी" },
  { code: "ta", name: "தமிழ்" },
]

export function RTISidebar() {
  const { draft, updateDraft } = useRTIStore()

  return (
    <div className="space-y-8">
      {/* Actions Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/50 p-8">
        <h3 className="text-xl font-light tracking-tight text-neutral-900 mb-8">Actions</h3>
        
        <div className="space-y-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-auto p-4 hover:bg-neutral-50 rounded-2xl group transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <FileText className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700 transition-colors" />
              <span className="text-sm font-light text-neutral-700 tracking-wide">Preview Document</span>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-auto p-4 hover:bg-neutral-50 rounded-2xl group transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <User className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700 transition-colors" />
              <span className="text-sm font-light text-neutral-700 tracking-wide">Add Details</span>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-auto p-4 hover:bg-neutral-50 rounded-2xl group transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <FileSignature className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700 transition-colors" />
              <span className="text-sm font-light text-neutral-700 tracking-wide">Add Signature</span>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-auto p-4 hover:bg-neutral-50 rounded-2xl group transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <Download className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700 transition-colors" />
              <span className="text-sm font-light text-neutral-700 tracking-wide">Export PDF</span>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-auto p-4 hover:bg-neutral-50 rounded-2xl group transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <Download className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700 transition-colors" />
              <span className="text-sm font-light text-neutral-700 tracking-wide">Export Word</span>
            </div>
          </Button>
          
          <Button
            variant="ghost"
            className="w-full justify-start text-left h-auto p-4 hover:bg-neutral-50 rounded-2xl group transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <Share2 className="w-4 h-4 text-neutral-500 group-hover:text-neutral-700 transition-colors" />
              <span className="text-sm font-light text-neutral-700 tracking-wide">Share</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Language Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-200/50 p-8">
        <div className="flex items-center gap-4 mb-8">
          <Globe className="w-5 h-5 text-neutral-600" />
          <h3 className="text-xl font-light tracking-tight text-neutral-900">Language</h3>
        </div>
        
        <Select
          value={draft.language || "en"}
          onValueChange={(value) => updateDraft({ language: value })}
        >
          <SelectTrigger className="border-neutral-200/60 focus:border-neutral-400 focus:ring-0 rounded-2xl px-6 py-4 h-auto bg-neutral-50/30 font-light">
            <SelectValue 
              placeholder="Select language" 
              className="text-neutral-700"
            />
          </SelectTrigger>
          <SelectContent className="border-neutral-200/60 rounded-2xl shadow-lg">
            {LANGUAGES.map((lang) => (
              <SelectItem 
                key={lang.code} 
                value={lang.code}
                className="font-light text-neutral-700 focus:bg-neutral-50"
              >
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 