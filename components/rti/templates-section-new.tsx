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
    <section id="templates" className="py-20 bg-gradient-to-b from-white via-slate-50/20 to-white">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-light text-slate-900 mb-4 tracking-tight">
            Expert Templates
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-light">
            Proven formats for every government transparency need
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-white/80 backdrop-blur-sm rounded-md"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-white/80 backdrop-blur-sm rounded-md">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Templates Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTemplates.map((template, index) => {
            const CategoryIcon = categoryIcons[template.category as keyof typeof categoryIcons] || Building;
            
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-sm hover:shadow-xl bg-white/80 backdrop-blur-sm transition-all duration-300 cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gray-50 rounded-md flex items-center justify-center">
                          <CategoryIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        {template.isVerified && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-gray-600" />
                            <span className="text-xs text-gray-700 font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                        {template.category}
                      </Badge>
                    </div>
                    
                    <CardTitle className="text-lg font-medium text-gray-900 leading-tight mb-2">
                      {template.title}
                    </CardTitle>
                    
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                      {template.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Star className="w-3 h-3 fill-current text-amber-400" />
                        <span>{template.usageCount} uses</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setPreviewTemplate(template)}
                        variant="outline"
                        size="sm"
                        className="flex-1 text-xs hover:bg-gray-900 hover:text-gray-50"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      
                      <Button
                        onClick={() => handleUseTemplate(template)}
                        size="sm"
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-xs"
                      >
                        Use Template
                        <ArrowRight className="w-3 h-3 ml-1" />
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
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{previewTemplate.title}</h3>
                  <Button
                    onClick={() => setPreviewTemplate(null)}
                    variant="ghost"
                    size="sm"
                  >
                    ×
                  </Button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto">
                <DocumentPreview content={previewTemplate.content} />
                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={() => {
                      handleUseTemplate(previewTemplate);
                      setPreviewTemplate(null);
                    }}
                    className="flex-1"
                  >
                    Use This Template
                  </Button>
                  <Button
                    onClick={() => setPreviewTemplate(null)}
                    variant="outline"
                    className="flex-1"
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