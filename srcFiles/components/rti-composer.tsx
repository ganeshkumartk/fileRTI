import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Mic, 
  Languages, 
  Eye, 
  Download,
  Save,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRTIContent, validateRTICompliance, exportToPDF, exportToWord } from "@/lib/utils";
import { useRTIStore } from "@/hooks/use-rti-store";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import VoiceInput from "./voice-input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Department {
  id: number;
  name: string;
  code: string;
  address: string;
  contactInfo: any;
}

export default function RTIComposer() {
  const { draft, updateDraft, isGuestMode, guestSessionId } = useRTIStore();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch departments
  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  // Auto-save mutation
  const saveDraftMutation = useMutation({
    mutationFn: async (draftData: any) => {
      const response = await apiRequest("POST", "/api/rti-applications", {
        ...draftData,
        isGuest: isGuestMode,
        guestSessionId: isGuestMode ? guestSessionId : undefined,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Draft saved successfully" });
    },
  });

  // AI generation mutation
  const generateRTIMutation = useMutation({
    mutationFn: async ({ query, departmentId }: { query: string; departmentId: number }) => {
      const response = await apiRequest("POST", "/api/ai/generate-rti", {
        query,
        departmentId,
        language: selectedLanguage,
      });
      return response.json();
    },
    onSuccess: (data) => {
      updateDraft({ 
        content: data.content,
        query: draft.query 
      });
      toast({ 
        title: "RTI content generated", 
        description: `Compliance score: ${data.compliance.score}%` 
      });
    },
  });

  // Translation mutation
  const translateMutation = useMutation({
    mutationFn: async ({ text, targetLang }: { text: string; targetLang: string }) => {
      const response = await apiRequest("POST", "/api/voice/translate", {
        text,
        sourceLanguage: selectedLanguage,
        targetLanguage: targetLang,
      });
      return response.json();
    },
    onSuccess: (data) => {
      updateDraft({ content: data.translatedText });
      setSelectedLanguage(data.targetLanguage);
      toast({ title: "Content translated successfully" });
    },
  });

  // Auto-save effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (draft.content && draft.query) {
        saveDraftMutation.mutate({
          title: draft.title || "Untitled RTI Application",
          content: draft.content,
          query: draft.query,
          departmentId: draft.departmentId,
          language: selectedLanguage,
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [draft.content, draft.query, draft.departmentId]);

  const handleVoiceTranscript = (transcript: string) => {
    updateDraft({ query: transcript });
    
    // Auto-generate RTI if department is selected
    if (draft.departmentId) {
      generateRTIMutation.mutate({
        query: transcript,
        departmentId: draft.departmentId,
      });
    }
  };

  const handleGenerateRTI = () => {
    if (!draft.query) {
      toast({
        title: "Query required",
        description: "Please enter your RTI query first.",
        variant: "destructive",
      });
      return;
    }

    if (!draft.departmentId) {
      toast({
        title: "Department required", 
        description: "Please select a government department.",
        variant: "destructive",
      });
      return;
    }

    generateRTIMutation.mutate({
      query: draft.query,
      departmentId: draft.departmentId,
    });
  };

  const compliance = validateRTICompliance(draft.content);
  const formattedContent = formatRTIContent(draft.content, draft.applicantDetails);
  const characterCount = draft.content.length;

  return (
    <section id="composer" className="px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Main Composer */}
          <div className="lg:col-span-2">
            <Card className="surface-premium border-0">
              <CardHeader className="pb-8">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl font-serif font-light text-gray-900">RTI Application Draft</CardTitle>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500 font-medium">
                      {saveDraftMutation.isPending ? "Saving..." : "Auto-saved"}
                    </span>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Query Input */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Your RTI Query
                  </label>
                  <div className="flex gap-4">
                    <Textarea
                      placeholder="Describe what information you need from the government..."
                      value={draft.query}
                      onChange={(e) => updateDraft({ query: e.target.value })}
                      className="flex-1 border-0 bg-gray-50 focus:bg-white shadow-soft rounded-xl transition-all duration-300 resize-none"
                      rows={3}
                    />
                    <VoiceInput 
                      size="medium" 
                      onTranscript={handleVoiceTranscript}
                      className="self-start mt-1 shadow-medium"
                    />
                  </div>
                  {draft.query && (
                    <Button 
                      onClick={handleGenerateRTI}
                      disabled={generateRTIMutation.isPending || !draft.departmentId}
                      className="mt-4 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 shadow-medium"
                    >
                      {generateRTIMutation.isPending ? "Generating..." : "Generate RTI with AI"}
                    </Button>
                  )}
                </div>

                {/* Editor Toolbar */}
                <div className="border border-gray-200 rounded-soft mb-4 p-3 flex flex-wrap items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ListOrdered className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <VoiceInput size="small" onTranscript={handleVoiceTranscript} />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      const targetLang = selectedLanguage === "en" ? "hi" : "en";
                      translateMutation.mutate({ text: draft.content, targetLang });
                    }}
                    disabled={translateMutation.isPending || !draft.content}
                  >
                    <Languages className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Rich Text Editor */}
                <Textarea
                  className="min-h-[400px] bg-gray-50 focus:bg-white transition-all font-mono text-sm leading-relaxed"
                  placeholder="Your RTI application will appear here. Use voice input or type directly..."
                  value={draft.content}
                  onChange={(e) => updateDraft({ content: e.target.value })}
                />
                
                {/* Character Count & Compliance */}
                <div className="flex justify-between items-center mt-4 text-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">{characterCount} / 3000 characters</span>
                    <div className="flex items-center space-x-2">
                      {compliance.isCompliant ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-700">RTI Act 2005 Compliant</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-orange-500" />
                          <span className="text-orange-700">
                            Compliance Score: {compliance.score}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Department Selection */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Government Department</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={draft.departmentId?.toString()} 
                  onValueChange={(value) => updateDraft({ departmentId: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-2">
                  Selected department will auto-populate contact details and relevant legal sections.
                </p>
              </CardContent>
            </Card>
            
            {/* Language & Translation */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Language Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedLanguage === "en" ? "default" : "outline"}
                      onClick={() => setSelectedLanguage("en")}
                      className="w-full"
                    >
                      English
                    </Button>
                    <Button
                      variant={selectedLanguage === "hi" ? "default" : "outline"}
                      onClick={() => setSelectedLanguage("hi")}
                      className="w-full"
                    >
                      हिंदी
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={selectedLanguage === "bn" ? "default" : "outline"}
                      onClick={() => setSelectedLanguage("bn")}
                      size="sm"
                    >
                      বাংলা
                    </Button>
                    <Button
                      variant={selectedLanguage === "ta" ? "default" : "outline"}
                      onClick={() => setSelectedLanguage("ta")}
                      size="sm"
                    >
                      தமிழ்
                    </Button>
                  </div>
                  <Button 
                    className="w-full bg-gradient-to-r from-primary-500 to-purple-600"
                    onClick={() => {
                      const targetLang = selectedLanguage === "en" ? "hi" : "en";
                      translateMutation.mutate({ text: draft.content, targetLang });
                    }}
                    disabled={translateMutation.isPending || !draft.content}
                  >
                    <Languages className="w-4 h-4 mr-2" />
                    {translateMutation.isPending ? "Translating..." : "Translate Draft"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Export Options */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle>Export & Share</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => exportToPDF(formattedContent)}
                  >
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                      <span>PDF Document</span>
                    </div>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => exportToWord(formattedContent)}
                  >
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded mr-3"></div>
                      <span>Word Document</span>
                    </div>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-gray-500 rounded mr-3"></div>
                      <span>Print Ready</span>
                    </div>
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-primary-600"
                      onClick={() => {
                        navigator.clipboard.writeText(formattedContent);
                        toast({ title: "Copied to clipboard" });
                      }}
                    >
                      Copy to Clipboard
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-primary-600"
                    >
                      Email Draft
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
          </div>
        </div>
      </div>
    </section>
  );
}
