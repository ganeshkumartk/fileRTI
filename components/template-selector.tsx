"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X, FileText, Tag, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

interface RTITemplate {
  id: string
  title: string
  description: string
  category: string
  template_content: string
  tags: string[]
  usage_count?: number
}

interface TemplateSelectorProps {
  language: string
  onSelectTemplate: (template: RTITemplate) => void
  onClose: () => void
}

const CATEGORIES = [
  { id: "education", name: "Education", icon: "🎓" },
  { id: "health", name: "Healthcare", icon: "🏥" },
  { id: "finance", name: "Finance", icon: "💰" },
  { id: "infrastructure", name: "Infrastructure", icon: "🏗️" },
  { id: "employment", name: "Employment", icon: "💼" },
]

export function TemplateSelector({ language, onSelectTemplate, onClose }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<RTITemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({ language })
        if (selectedCategory) params.append("category", selectedCategory)
        if (searchQuery) params.append("search", searchQuery)

        const response = await fetch(`/api/rti/templates?${params}`)

        if (!response.ok) {
          throw new Error("Failed to fetch templates")
        }

        const data = await response.json()

        if (data.error) {
          setError(data.error)
          return
        }

        setTemplates(data.templates || [])
      } catch (err) {
        setError("Unable to load templates. Please check your connection.")
        console.error("Error fetching templates:", err)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchTemplates, searchQuery ? 300 : 0)
    return () => clearTimeout(debounceTimer)
  }, [language, selectedCategory, searchQuery])

  const sortedTemplates = useMemo(() => {
    return [...templates].sort((a, b) => {
      // Sort by usage count, then by title
      const usageA = a.usage_count || 0
      const usageB = b.usage_count || 0
      if (usageA !== usageB) return usageB - usageA
      return a.title.localeCompare(b.title)
    })
  }, [templates])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Choose Template</h3>
              <p className="text-sm text-gray-600 mt-1">Select a pre-built RTI template to get started</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 rounded-full hover:bg-gray-100">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              className="pl-11 h-12 text-base border-gray-200 focus:border-gray-400 focus:ring-0 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              className="text-sm rounded-full"
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>

            {CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className="text-sm rounded-full"
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-6">
                  <Skeleton className="h-5 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-red-600 font-medium mb-2">Unable to Load Templates</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          ) : sortedTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-2">No Templates Found</p>
              <p className="text-sm text-gray-500">Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {sortedTemplates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="group border border-gray-100 rounded-xl p-6 hover:border-gray-200 hover:shadow-sm cursor-pointer transition-all duration-200"
                    onClick={() => onSelectTemplate(template)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900 group-hover:text-gray-700">{template.title}</h4>
                          {template.usage_count && template.usage_count > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                              <TrendingUp className="h-3 w-3" />
                              Popular
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3 leading-relaxed">{template.description}</p>

                        {template.tags && template.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {template.tags.slice(0, 4).map((tag) => (
                              <div
                                key={tag}
                                className="flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
                              >
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </div>
                            ))}
                            {template.tags.length > 4 && (
                              <div className="text-xs text-gray-500 px-2 py-1">+{template.tags.length - 4} more</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {sortedTemplates.length} template{sortedTemplates.length !== 1 ? "s" : ""} available
          </div>
          <Button variant="outline" onClick={onClose} className="rounded-full">
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
