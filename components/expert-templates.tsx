"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Eye, 
  Users,
  BookOpen
} from "lucide-react"

interface Template {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  usage_count: number
  is_featured: boolean
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
  "Environment"
]

const TEMPLATE_CATEGORIES: Record<string, { color: string; bgColor: string }> = {
  "Healthcare": { color: "text-neutral-700", bgColor: "bg-neutral-100" },
  "Social Welfare": { color: "text-neutral-700", bgColor: "bg-neutral-100" },
  "Food Security": { color: "text-neutral-700", bgColor: "bg-neutral-100" },
  "Education": { color: "text-neutral-700", bgColor: "bg-neutral-100" },
  "Infrastructure": { color: "text-neutral-700", bgColor: "bg-neutral-100" },
  "Water & Sanitation": { color: "text-neutral-700", bgColor: "bg-neutral-100" },
  "Law & Order": { color: "text-neutral-700", bgColor: "bg-neutral-100" },
  "Urban Planning": { color: "text-neutral-700", bgColor: "bg-neutral-100" },
  "Employment": { color: "text-neutral-700", bgColor: "bg-neutral-100" },
  "Environment": { color: "text-neutral-700", bgColor: "bg-neutral-100" }
}

export function ExpertTemplates() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  // Mock templates data
  useEffect(() => {
    const mockTemplates: Template[] = [
      {
        id: "1",
        title: "Hospital Equipment & Medicine Stock",
        description: "Check availability of medical equipment and medicines in government hospitals",
        category: "Healthcare",
        tags: ["medical", "equipment", "stock"],
        usage_count: 234,
        is_featured: true
      },
      {
        id: "2", 
        title: "Pension & Social Security Payments",
        description: "Track pension disbursements and social security scheme payments",
        category: "Social Welfare",
        tags: ["pension", "social security", "payments"],
        usage_count: 203,
        is_featured: true
      },
      {
        id: "3",
        title: "Ration Shop Stock & Distribution",
        description: "Check PDS stock and distribution records at local ration shops",
        category: "Food Security", 
        tags: ["ration", "PDS", "distribution"],
        usage_count: 198,
        is_featured: true
      },
      {
        id: "4",
        title: "School Mid-Day Meal Quality & Funds",
        description: "Verify quality and fund utilization of school meal programs",
        category: "Education",
        tags: ["school", "meal", "funds"],
        usage_count: 189,
        is_featured: false
      },
      {
        id: "5",
        title: "Scholarship Scheme Beneficiaries", 
        description: "Get details about scholarship distribution and selection criteria",
        category: "Education",
        tags: ["scholarship", "beneficiaries", "criteria"],
        usage_count: 176,
        is_featured: false
      },
      {
        id: "6",
        title: "Road Repair & Maintenance Contracts",
        description: "Get details about local road repair work and contractor payments",
        category: "Infrastructure",
        tags: ["road", "repair", "contracts"],
        usage_count: 167,
        is_featured: false
      }
    ]
    
    setTemplates(mockTemplates)
    setFilteredTemplates(mockTemplates)
    setLoading(false)
  }, [])

  // Filter templates
  useEffect(() => {
    let filtered = templates

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter(template => template.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(template => 
        template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredTemplates(filtered)
  }, [templates, selectedCategory, searchQuery])

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light tracking-tight text-neutral-900 mb-4">Expert Templates</h2>
          <p className="text-xl font-light text-neutral-600 max-w-2xl mx-auto">Proven formats for every government transparency need</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-6 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 border-neutral-200/60 focus:border-neutral-400 focus:ring-0 rounded-2xl px-6 py-4 h-auto bg-neutral-50/30 font-light tracking-wide"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-64 border-neutral-200/60 focus:border-neutral-400 focus:ring-0 rounded-2xl px-6 py-4 h-auto bg-neutral-50/30 font-light">
              <Filter className="h-4 w-4 mr-3 text-neutral-500" />
              <SelectValue className="text-neutral-700" />
            </SelectTrigger>
            <SelectContent className="border-neutral-200/60 rounded-2xl shadow-lg">
              {CATEGORIES.map((category) => (
                <SelectItem 
                  key={category} 
                  value={category}
                  className="font-light text-neutral-700 focus:bg-neutral-50"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredTemplates.map((template) => {
            const categoryStyle = TEMPLATE_CATEGORIES[template.category] || TEMPLATE_CATEGORIES["Healthcare"]
            
            return (
              <div key={template.id} className="bg-white border border-neutral-200/50 rounded-3xl p-8 hover:shadow-sm hover:border-neutral-300/50 transition-all duration-300">
                {/* Category & Verified Badge */}
                <div className="flex items-center justify-between mb-6">
                  <Badge 
                    variant="secondary" 
                    className={`${categoryStyle.bgColor} ${categoryStyle.color} text-xs font-light border-0 px-3 py-1 rounded-full tracking-wide`}
                  >
                    {template.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs text-neutral-600 font-light">
                    <CheckCircle className="h-3 w-3" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="font-light text-xl tracking-tight text-neutral-900 mb-3 line-clamp-2">
                  {template.title}
                </h3>
                <p className="text-sm font-light text-neutral-600 mb-6 line-clamp-2 leading-relaxed">
                  {template.description}
                </p>

                {/* Stats & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-xs text-neutral-500 font-light">
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      <span>{template.usage_count} uses</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-neutral-500 hover:text-neutral-700 font-light">
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                  </div>
                  <Button size="sm" className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs px-6 py-2 rounded-xl font-light tracking-wide transition-colors">
                    Use Template
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-neutral-50 rounded-3xl p-16">
          <div className="max-w-lg mx-auto">
            <div className="w-20 h-20 bg-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <BookOpen className="w-8 h-8 text-neutral-600" />
            </div>
            <h3 className="text-2xl font-light tracking-tight text-neutral-900 mb-4">Need a Custom Template?</h3>
            <p className="text-neutral-600 mb-8 font-light leading-relaxed">
              Can't find what you're looking for? Create a custom RTI application with our AI composer.
            </p>
            <Button className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-3 rounded-2xl font-light tracking-wide transition-colors">
              Start Custom RTI
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
} 