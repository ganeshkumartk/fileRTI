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
import DocumentPreview from "./document-preview";
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

export default function TemplatesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [previewTemplate, setPreviewTemplate] = useState<RTITemplate | null>(null);
  const { loadTemplate } = useRTIStore();

  const { data: templates = [] } = useQuery<RTITemplate[]>({
    queryKey: ["/api/templates"],
  });

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
                        <div className="w-10 h-10 bg-blue-50 rounded-md flex items-center justify-center">
                          <CategoryIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        {template.isVerified && (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-xs text-green-600 font-medium">Verified</span>
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Star className="w-3 h-3 fill-current text-amber-400" />
                        <span>{template.usageCount} uses</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => setPreviewTemplate(template)}
                          variant="ghost"
                          size="sm"
                          className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/50 hover:border-slate-300/50 transition-all duration-200"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        
                        <Button
                          onClick={() => handleUseTemplate(template)}
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm hover:shadow-md transition-all duration-200 group-hover:bg-blue-700"
                        >
                          Use Template
                          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* No Results */}
        {filteredTemplates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-light text-gray-900 mb-4">
              Need a Custom Template?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Can't find what you're looking for? Create a custom RTI application with our AI composer.
            </p>
            <Button 
              onClick={() => {
                const composerElement = document.getElementById('composer');
                if (composerElement) {
                  composerElement.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              Start Custom RTI
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>

        {/* Template Preview Modal */}
        {previewTemplate && (
          <DocumentPreview
            isOpen={!!previewTemplate}
            onClose={() => setPreviewTemplate(null)}
            content={previewTemplate.content}
            applicantDetails={null}
          />
        )}
      </div>
    </section>
  );
}