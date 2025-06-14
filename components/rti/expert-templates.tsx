"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import { useRTIStore } from "@/hooks/use-rti-store"
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Eye, 
  Users,
  BookOpen,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Copy,
  Download
} from "lucide-react"

interface Template {
  id: string
  title: string
  description: string | null
  category: string
  template_content: string
  language_code: string
  tags: string[]
  usage_count: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

const CATEGORIES = [
  "All Categories",
  "Healthcare", 
  "Social Welfare",
  "Food Security",
  "Education",
  "Infrastructure",
  "Water & Sanitation",
  "Law & Order", 
  "Urban Planning",
  "Employment",
  "Environment",
  "Revenue"
]



export function ExpertTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  
  const { updateDraft } = useRTIStore()

  // Responsive templates per page
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // sm breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const TEMPLATES_PER_PAGE = isMobile ? 2 : 6
  const totalPages = Math.ceil(filteredTemplates.length / TEMPLATES_PER_PAGE)
  const currentTemplates = filteredTemplates.slice(
    currentPage * TEMPLATES_PER_PAGE,
    (currentPage + 1) * TEMPLATES_PER_PAGE
  )

  // Fetch templates from Supabase
  useEffect(() => {
    async function fetchTemplates() {
      try {
        setLoading(true)
        setError(null)
        
        const supabase = createClient()
        
        const { data, error: fetchError } = await supabase
          .from('rti_templates')
          .select('*')
          .eq('is_active', true)
          .order('usage_count', { ascending: false })

        if (fetchError) {
          console.error('Error fetching templates:', fetchError)
          setError('Failed to load templates. Please try again.')
          return
        }

        // Deduplicate templates based on title and category
        const deduplicatedTemplates = data?.reduce((acc: Template[], current: Template) => {
          const isDuplicate = acc.some(template => 
            template.title.toLowerCase() === current.title.toLowerCase() && 
            template.category === current.category
          )
          if (!isDuplicate) {
            acc.push(current)
          }
          return acc
        }, []) || []

        setTemplates(deduplicatedTemplates)
        setFilteredTemplates(deduplicatedTemplates)
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  // Filter templates and reset pagination
  useEffect(() => {
    let filtered = templates

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(template => 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredTemplates(filtered)
    setCurrentPage(0) // Reset to first page when filters change
  }, [templates, selectedCategory, searchQuery])

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template)
    setShowPreview(true)
  }

  const handleUseTemplate = async (template: Template) => {
    try {
      // Update the RTI store with template content
      updateDraft({ 
        content: template.template_content,
        query: `Information request based on ${template.title}` 
      })

      // Update usage count
      const supabase = createClient()
      await supabase
        .from('rti_templates')
        .update({ usage_count: template.usage_count + 1 })
        .eq('id', template.id)

      toast.success("Template Applied", {
        description: "The template has been loaded into your RTI composer.",
      })

      // Scroll to composer section
      const composerElement = document.getElementById('composer')
      if (composerElement) {
        composerElement.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (error) {
      console.error('Error using template:', error)
      toast.error("Error", {
        description: "Failed to apply template. Please try again.",
      })
    }
  }

  const handleCopyTemplate = () => {
    if (previewTemplate) {
      navigator.clipboard.writeText(previewTemplate.template_content)
      toast.success("Copied to Clipboard", {
        description: "Template content has been copied to your clipboard.",
      })
    }
  }

  const handleExportTemplate = (format: 'pdf' | 'word') => {
    if (previewTemplate) {
      // This would call the actual export functions
      toast.success(`Export ${format.toUpperCase()}`, {
        description: `Template exported as ${format.toUpperCase()}`,
      })
    }
  }

  const formatTemplateContent = (content: string) => {
    if (!content) return "No content available"
    
    // Get user details from RTI store
    const { draft } = useRTIStore.getState()
    const applicantDetails = draft.applicantDetails
    
    // Clean the template content to extract only the main information request
    let cleanContent = content
      .replace(/\[YOUR NAME\]/g, applicantDetails?.name || '[Your Name]')
      .replace(/\[YOUR ADDRESS\]/g, applicantDetails?.address || '[Your Address]')
      .replace(/\[YOUR CONTACT\]/g, applicantDetails?.contact || '[Your Contact]')
      .replace(/\[YOUR EMAIL\]/g, applicantDetails?.email || '[Your Email]')
      .replace(/\[DEPARTMENT_NAME\]/g, '[Department Name]')

    // Remove RTI structure elements to show only the core content
    cleanContent = cleanContent
      .replace(/<h2>Application for Information under Right to Information Act, 2005<\/h2>/g, '')
      .replace(/<p><strong>To:<\/strong>[\s\S]*?<\/p>/g, '')
      .replace(/<p><strong>Subject:<\/strong>.*?<\/p>/g, '')
      .replace(/Dear Sir\/Madam,/g, '')
      .replace(/I, \[YOUR NAME\], a citizen of India, hereby request the following information under the Right to Information Act, 2005:/g, '')
      .replace(/I am enclosing the application fee.*?RTI Act\./g, '')
      .replace(/Please provide the information.*?2005\./g, '')
      .replace(/Thank you for your cooperation\./g, '')
      .replace(/Yours faithfully,[\s\S]*?Applicant/g, '')
      .replace(/^\s*<p>\s*<\/p>/gm, '') // Remove empty paragraphs
      .replace(/^\s*<br\/?>\s*/gm, '') // Remove leading breaks
      .trim()

    // Enhanced formatting for the cleaned content
    return cleanContent
      .replace(/<h2>/g, '<h2 class="text-xl font-bold text-gray-900 mb-4">')
      .replace(/<h3>/g, '<h3 class="text-lg font-semibold text-gray-900 mb-3">')
      .replace(/<strong>/g, '<strong class="font-semibold text-gray-900">')
      .replace(/<em>/g, '<em class="italic text-gray-700">')
      .replace(/<ul>/g, '<ul class="list-disc list-inside space-y-2 my-4">')
      .replace(/<ol>/g, '<ol class="list-decimal list-inside space-y-2 my-4">')
      .replace(/<li>/g, '<li class="text-gray-800">')
      .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-gray-300 pl-4 my-6 italic text-gray-700 bg-gray-50 p-4 rounded-r">')
      .replace(/\n/g, '<br/>')
  }

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  // Loading state
  if (loading) {
    return (
      <section className="py-8 md:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 md:mb-16 lg:mb-20"
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-gray-900 mb-3 md:mb-6">Expert Templates</h2>
            <p className="text-base sm:text-xl font-light text-gray-500 max-w-2xl mx-auto px-4">Curated formats for government transparency</p>
          </motion.div>
          
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border border-gray-200 border-t-gray-900"></div>
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="py-8 md:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6 md:mb-16 lg:mb-20"
          >
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-gray-900 mb-3 md:mb-6">Expert Templates</h2>
            <p className="text-base sm:text-xl font-light text-gray-500 max-w-2xl mx-auto px-4">Curated formats for government transparency</p>
          </motion.div>
          
          <Card className="max-w-md mx-auto border-0 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertTriangle className="h-12 w-12 text-gray-400 mb-6" />
              <CardTitle className="text-lg font-light text-gray-900 mb-2">Unable to Load Templates</CardTitle>
              <CardDescription className="text-center mb-6">{error}</CardDescription>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-16 lg:mb-20"
        >
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-gray-900 mb-3 md:mb-6">Expert Templates</h2>
          <p className="text-base sm:text-xl font-light text-gray-500 max-w-2xl mx-auto px-4">Curated formats for government transparency</p>
        </motion.div>

        {/* Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-6 md:mb-16 max-w-2xl mx-auto"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 border-gray-200 focus:border-gray-400 focus:ring-0 rounded-full h-11 sm:h-12 bg-gray-50/50 font-light text-sm sm:text-base"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 border-gray-200 focus:border-gray-400 focus:ring-0 rounded-full h-11 sm:h-12 bg-gray-50/50 font-light text-sm sm:text-base">
              <Filter className="h-4 w-4 mr-2 text-gray-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-gray-200 rounded-2xl shadow-xl">
              {CATEGORIES.map((category) => (
                <SelectItem 
                  key={category} 
                  value={category}
                  className="font-light text-gray-700 focus:bg-gray-50 rounded-lg"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Templates Carousel */}
        <div className="relative mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8"
            >
              {currentTemplates.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 font-light">No templates found matching your criteria.</p>
                </div>
              ) : (
                currentTemplates.map((template, index) => (
                  <motion.div
                    key={`${template.id}-${template.title}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm">
                      <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                        <div className="flex items-center justify-between mb-2 sm:mb-4">
                          <Badge 
                            variant="secondary" 
                            className="bg-gray-100 text-gray-700 text-xs font-light border-0 rounded-full px-2 py-1"
                          >
                            {template.category}
                          </Badge>
                          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500 font-light">
                            <CheckCircle className="h-3 w-3" />
                            <span>Verified</span>
                          </div>
                        </div>
                        <CardTitle className="font-light text-sm sm:text-lg tracking-tight text-gray-900 line-clamp-2 leading-tight">
                          {template.title}
                        </CardTitle>
                        <CardDescription className="hidden sm:block font-light text-gray-600 line-clamp-2 leading-relaxed">
                          {template.description || "Professional RTI template"}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0 px-3 sm:px-6 hidden sm:block">
                        <div className="flex items-center gap-4 text-xs text-gray-500 font-light mb-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{template.usage_count}</span>
                          </div>
                          <Separator orientation="vertical" className="h-3" />
                          <span>{template.tags.slice(0, 2).join(', ')}</span>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6 flex flex-col sm:flex-row gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handlePreview(template)}
                          className="w-full sm:flex-1 text-gray-600 hover:text-gray-900 hover:bg-gray-900 hover:text-gray-50 font-light text-xs sm:text-sm h-8 sm:h-9"
                        >
                          <Eye className="h-3 w-3 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">Preview</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleUseTemplate(template)}
                          className="w-full sm:flex-1 bg-gray-900 hover:bg-gray-800 text-white font-light text-xs sm:text-sm h-8 sm:h-9"
                        >
                          <span className="hidden sm:inline">Use Template</span>
                          <span className="sm:hidden">Use</span>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>

          {/* Carousel Navigation */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="rounded-full w-10 h-10 p-0 hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                      i === currentPage ? 'bg-gray-900 w-6' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="rounded-full w-10 h-10 p-0 hover:bg-gray-100 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto border-0 shadow-sm bg-gray-50/50">
            <CardContent className="py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <BookOpen className="w-6 h-6 text-gray-600" />
              </div>
              <CardTitle className="text-2xl font-light tracking-tight text-gray-900 mb-4">
                Need a Custom Template?
              </CardTitle>
              <CardDescription className="text-gray-600 mb-8 font-light leading-relaxed max-w-md mx-auto">
                Create a personalized RTI application with our AI-powered composer for your specific needs.
              </CardDescription>
              <Button 
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-full font-light"
                onClick={() => {
                  const composerElement = document.getElementById('composer')
                  if (composerElement) {
                    composerElement.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                Start Custom RTI
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Fixed Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="w-[95vw] max-w-4xl h-[90vh] sm:h-[85vh] md:h-[90vh] flex flex-col p-0 gap-0">
            {/* Fixed Header */}
            <DialogHeader className="flex-shrink-0 border-b border-gray-200 p-4 sm:p-6 pr-12 sm:pr-16">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-lg sm:text-xl font-light text-gray-900 tracking-tight truncate">
                    {previewTemplate?.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm sm:text-base text-gray-600 font-light mt-1">
                    Template Preview
                  </DialogDescription>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-light text-xs">
                    {previewTemplate?.category}
                  </Badge>
                </div>
              </div>
            </DialogHeader>
            
            {/* Scrollable Content */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 sm:p-6">
                  <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
                    {/* Content Header */}
                    <div className="text-center">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Template Content</h3>
                      <p className="text-xs sm:text-sm text-gray-600">This content will be included in your RTI application</p>
                    </div>
                    
                    {/* Template Content */}
                    <Card className="border border-gray-200">
                      <CardContent className="p-4 sm:p-6">
                        <div 
                          className="prose prose-xs sm:prose-sm prose-gray max-w-none leading-relaxed text-gray-800"
                          dangerouslySetInnerHTML={{ 
                            __html: formatTemplateContent(previewTemplate?.template_content || "") 
                          }}
                        />
                      </CardContent>
                    </Card>
                    
                    {/* Usage Info */}
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-full">
                        <Users className="h-3 w-3" />
                        <span className="hidden sm:inline">{previewTemplate?.usage_count} people have used this template</span>
                        <span className="sm:hidden">{previewTemplate?.usage_count} uses</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>

            {/* Fixed Footer */}
            <div className="flex-shrink-0 border-t border-gray-200 p-3 sm:p-4 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleCopyTemplate}
                  className="order-2 sm:order-1 hover:bg-gray-900 hover:text-gray-50 border-gray-200 text-gray-600 hover:text-gray-900 text-xs sm:text-sm h-8 sm:h-9"
                  size="sm"
                >
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Copy
                </Button>
                <Button 
                  onClick={() => {
                    if (previewTemplate) {
                      handleUseTemplate(previewTemplate)
                      setShowPreview(false)
                    }
                  }}
                  className="order-1 sm:order-2 bg-gray-900 hover:bg-gray-800 text-white font-light text-xs sm:text-sm h-8 sm:h-9"
                  size="sm"
                >
                  Use This Template
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
} 