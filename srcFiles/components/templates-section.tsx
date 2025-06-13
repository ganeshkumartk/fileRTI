import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Building, FileText, Users, ArrowRight, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRTIStore } from "@/hooks/use-rti-store";
import { useToast } from "@/hooks/use-toast";

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
  Finance: Building,
  Policy: FileText,
  Employment: Users,
};

const categoryColors = {
  Finance: "from-blue-500 to-cyan-500",
  Policy: "from-green-500 to-emerald-500", 
  Employment: "from-purple-500 to-pink-500",
};

export default function TemplatesSection() {
  const { loadTemplate } = useRTIStore();
  const { toast } = useToast();

  const { data: templates = [], isLoading } = useQuery<RTITemplate[]>({
    queryKey: ["/api/templates"],
  });

  const handleUseTemplate = (template: RTITemplate) => {
    loadTemplate(template.content, template.id);
    toast({
      title: "Template loaded",
      description: `${template.title} has been loaded into the composer.`,
    });

    // Scroll to composer
    document.getElementById('composer')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  if (isLoading) {
    return (
      <section id="templates" className="bg-white py-20 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-soft h-48"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="templates" className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-serif font-light text-gray-900 mb-8 tracking-tight">RTI Templates</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Start with professionally crafted templates for common RTI queries. 
            Each template is pre-validated for legal compliance.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, index) => {
            const IconComponent = categoryIcons[template.category as keyof typeof categoryIcons] || FileText;
            const colorClass = categoryColors[template.category as keyof typeof categoryColors] || "from-gray-500 to-gray-600";
            
            return (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <Card className="bg-white hover:shadow-large transition-all duration-300 cursor-pointer border-0 shadow-medium h-full group">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-14 h-14 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center shadow-medium group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="text-white w-7 h-7" />
                      </div>
                      {template.isVerified && (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-0">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                      {template.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">
                        Used {template.usageCount.toLocaleString()}+ times
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUseTemplate(template)}
                        className="text-primary-600 hover:text-primary-700 hover:bg-primary-50 group-hover:translate-x-1 transition-all"
                      >
                        Use Template <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button 
            variant="outline" 
            size="lg"
            className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white"
          >
            View All Templates <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
