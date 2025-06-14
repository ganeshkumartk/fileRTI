import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Filter, 
  User, 
  Building, 
  Heart, 
  GraduationCap,
  Shield,
  Droplets,
  Car,
  Briefcase,
  Home,
  Leaf,
  Users,
  ArrowRight,
  Star,
  CheckCircle,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRTIStore } from "@/hooks/use-rti-store";
import DocumentPreview from "@/components/shared/document-preview";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RTITemplate {
  id: number;
  title: string;
  description: string;
  content: string;
  category: string;
  usageCount: number;
  isVerified: boolean;
}

const categoryIcons = {
  "Healthcare": Heart,
  "Education": GraduationCap,
  "Infrastructure": Building,
  "Law & Order": Shield,
  "Food Security": Users,
  "Water & Sanitation": Droplets,
  "Revenue": User,
  "Employment": Briefcase,
  "Urban Planning": Home,
  "Environment": Leaf,
  "Social Welfare": Users,
  "Transportation": Car
};

// Mock templates data
const mockTemplates: RTITemplate[] = [
  {
    id: 1,
    title: "School Infrastructure Details",
    description: "Request information about school buildings, facilities, and maintenance records",
    content: "I request information about the infrastructure details of government schools in my area including construction status, facilities available, and maintenance records.",
    category: "Education",
    usageCount: 125,
    isVerified: true,
  },
  {
    id: 2,
    title: "Road Construction Status",
    description: "Get updates on road construction projects and budget allocation",
    content: "I request information about the current status of road construction projects in my area, including budget allocation, contractors details, and completion timeline.",
    category: "Infrastructure",
    usageCount: 89,
    isVerified: true,
  },
  {
    id: 3,
    title: "Public Hospital Services",
    description: "Information about hospital services, staff, and medical facilities",
    content: "I request information about the services provided by public hospitals, staff details, medical equipment available, and patient care facilities.",
    category: "Healthcare",
    usageCount: 156,
    isVerified: true,
  },
];

export default function TemplatesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [previewTemplate, setPreviewTemplate] = useState<RTITemplate | null>(null);
  const { loadTemplate } = useRTIStore();

  const templates = mockTemplates;

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(templates.map(t => t.category)));

  const handleUseTemplate = (template: RTITemplate) => {
    loadTemplate(template.content, template.id);
    
    // Smooth scroll to composer
    const composerElement = document.getElementById('composer');
    if (composerElement) {
      composerElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 mb-4 md:mb-6 tracking-tight">
            RTI Templates
          </h2>
          <p className="text-lg sm:text-xl font-light text-gray-500 max-w-2xl mx-auto px-4">
            Choose from our curated collection of professional RTI templates
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-11 sm:h-12 border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-white/80 backdrop-blur-sm rounded-xl text-sm sm:text-base"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48 border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-white/80 backdrop-blur-sm rounded-xl h-11 sm:h-12 text-sm sm:text-base">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Templates Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {filteredTemplates.map((template, index) => {
            const CategoryIcon = categoryIcons[template.category as keyof typeof categoryIcons] || Building;
            
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Card className="h-full border border-gray-200 hover:border-gray-300 bg-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <CategoryIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-light text-xs mb-1 sm:mb-2">
                            {template.category}
                          </Badge>
                          <CardTitle className="text-sm sm:text-base font-light text-gray-900 leading-tight line-clamp-2">
                            {template.title}
                          </CardTitle>
                        </div>
                      </div>
                      {template.isVerified && (
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-xs sm:text-sm text-gray-600 font-light mb-3 sm:mb-4 line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Star className="w-3 h-3 fill-current text-amber-400" />
                        <span>{template.usageCount} uses</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={() => setPreviewTemplate(template)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs sm:text-sm hover:bg-gray-900 hover:text-gray-50 h-8 sm:h-9"
                      >
                        <Eye className="w-3 h-3 mr-1 sm:mr-2" />
                        Preview
                      </Button>
                      
                      <Button
                        onClick={() => handleUseTemplate(template)}
                        size="sm"
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <span className="mr-1 sm:mr-2">Use Template</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates found matching your criteria.</p>
          </div>
        )}

        {/* Template Preview Modal */}
        {previewTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl md:max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 pr-4 line-clamp-1">
                    {previewTemplate.title}
                  </h3>
                  <Button
                    onClick={() => setPreviewTemplate(null)}
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    ×
                  </Button>
                </div>
              </div>
              <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <DocumentPreview content={previewTemplate.content} />
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => {
                      handleUseTemplate(previewTemplate);
                      setPreviewTemplate(null);
                    }}
                    className="flex-1 order-2 sm:order-1"
                  >
                    Use This Template
                  </Button>
                  <Button
                    onClick={() => setPreviewTemplate(null)}
                    variant="outline"
                    className="flex-1 order-1 sm:order-2"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 