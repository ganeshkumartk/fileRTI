import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Download,
  Share2,
  FileText,
  User,
  Building,
  Languages,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRTIContent, validateRTICompliance, exportToPDF, exportToWord, getWordCount } from "@/lib/utils";
import { useRTIStore } from "@/hooks/use-rti-store";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import VoiceInput from "./voice-input";
import DocumentPreview from "./document-preview";
import SignaturePad from "./signature-pad";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Department {
  id: number;
  name: string;
  code: string;
  address: string;
  contactInfo: any;
}

export default function RTIComposer() {
  const { draft, updateDraft, isGuestMode, guestSessionId, setApplicantDetails } = useRTIStore();
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showApplicantForm, setShowApplicantForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [applicantData, setApplicantData] = useState({
    name: "",
    email: "",
    contact: "",
    address: ""
  });
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch departments
  const { data: departments = [] } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
  });

  // Text formatting functions
  const formatText = (format: string) => {
    if (!contentRef.current) return;
    
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    if (!selectedText) return;
    
    let formattedText = "";
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "list":
        formattedText = `\n- ${selectedText}`;
        break;
      case "numbered":
        formattedText = `\n1. ${selectedText}`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    updateDraft({ content: newContent });
  };

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
        title: "RTI generated successfully", 
        description: `Compliance score: ${data.compliance.score}%` 
      });
    },
  });

  const handleVoiceTranscript = (transcript: string) => {
    updateDraft({ query: transcript });
    
    if (draft.departmentId) {
      generateRTIMutation.mutate({
        query: transcript,
        departmentId: draft.departmentId,
      });
    }
  };

  const handleGenerateRTI = () => {
    if (!draft.query.trim()) {
      toast({
        title: "Query required",
        description: "Please describe what information you need.",
        variant: "destructive",
      });
      return;
    }

    if (!draft.departmentId) {
      toast({
        title: "Department required", 
        description: "Please select the relevant government department.",
        variant: "destructive",
      });
      return;
    }

    generateRTIMutation.mutate({
      query: draft.query,
      departmentId: draft.departmentId,
    });
  };

  const handleSaveApplicantDetails = () => {
    setApplicantDetails(applicantData);
    setShowApplicantForm(false);
    toast({ title: "Applicant details saved" });
  };

  const handleExport = (format: 'pdf' | 'word') => {
    if (!draft.content.trim()) {
      toast({
        title: "No content to export",
        description: "Please generate RTI content first.",
        variant: "destructive",
      });
      return;
    }

    const formattedContent = formatRTIContent(draft.content, draft.applicantDetails || applicantData);
    
    if (format === 'pdf') {
      exportToPDF(formattedContent, `rti-application-${Date.now()}.pdf`, signature);
    } else {
      exportToWord(formattedContent, `rti-application-${Date.now()}.docx`, signature);
    }

    toast({ title: `RTI exported as ${format.toUpperCase()}` });
  };

  const handleShare = () => {
    if (!draft.content.trim()) {
      toast({
        title: "No content to share",
        description: "Please generate RTI content first.",
        variant: "destructive",
      });
      return;
    }

    navigator.clipboard.writeText(draft.content);
    toast({ title: "RTI content copied to clipboard" });
  };

  const compliance = validateRTICompliance(draft.content);
  const wordCount = getWordCount(draft.content);
  const characterCount = draft.content.length;

  return (
    <section id="composer" className="py-20 bg-gradient-to-b from-white via-slate-50/20 to-white">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-light text-slate-900 mb-4 tracking-tight">
            Professional Composer
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto font-light">
            AI-powered legal precision for government transparency
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Main Composer */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-light text-gray-900 tracking-wide">
                    Your RTI Application
                  </CardTitle>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Auto-saved
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* Query Input */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <label className="text-sm font-medium text-gray-900">
                      What information do you need?
                    </label>
                  </div>
                  
                  <div className="relative">
                    <Textarea
                      placeholder="Describe the specific government information you're seeking..."
                      value={draft.query}
                      onChange={(e) => updateDraft({ query: e.target.value })}
                      className="pr-16 border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-gray-50/50 rounded-md resize-none transition-all duration-200"
                      rows={3}
                    />
                    <div className="absolute top-3 right-3">
                      <VoiceInput 
                        size="small" 
                        onTranscript={handleVoiceTranscript}
                      />
                    </div>
                  </div>
                </div>

                {/* Department Selection */}
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Building className="w-5 h-5 text-blue-600" />
                    <label className="text-sm font-medium text-gray-900">
                      Government Department
                    </label>
                  </div>
                  
                  <Select 
                    value={draft.departmentId?.toString()} 
                    onValueChange={(value) => updateDraft({ departmentId: parseInt(value) })}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-gray-50/50 rounded-md">
                      <SelectValue placeholder="Select the relevant department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Generate Button */}
                {draft.query && draft.departmentId && (
                  <Button 
                    onClick={handleGenerateRTI}
                    disabled={generateRTIMutation.isPending}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-md shadow-md hover:shadow-lg transition-all duration-300"
                    size="lg"
                  >
                    {generateRTIMutation.isPending ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate RTI Application
                      </>
                    )}
                  </Button>
                )}

                <Separator />

                {/* Content Editor */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <label className="text-sm font-medium text-gray-900">
                        RTI Application Content
                      </label>
                    </div>
                    
                    {/* Formatting Toolbar */}
                    <div className="flex items-center space-x-1 bg-gray-100 rounded-md p-1">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => formatText("bold")}
                        className="h-8 w-8 p-0 hover:bg-white"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => formatText("italic")}
                        className="h-8 w-8 p-0 hover:bg-white"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => formatText("list")}
                        className="h-8 w-8 p-0 hover:bg-white"
                      >
                        <List className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => formatText("numbered")}
                        className="h-8 w-8 p-0 hover:bg-white"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  
                  <Textarea
                    ref={contentRef}
                    placeholder="Your RTI application content will appear here..."
                    value={draft.content}
                    onChange={(e) => updateDraft({ content: e.target.value })}
                    className="min-h-[300px] border-gray-200 focus:border-blue-300 focus:ring-blue-200 bg-gray-50/50 rounded-md resize-none font-mono text-sm leading-relaxed"
                  />
                  
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                    <span>{wordCount} words • {characterCount} characters</span>
                    {compliance.isCompliant && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>RTI Compliant</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/50 pb-4">
                  <CardTitle className="text-lg font-light text-slate-900">Actions</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/50 hover:border-slate-300/50 transition-all duration-200"
                    onClick={() => setShowPreview(true)}
                    disabled={!draft.content.trim()}
                  >
                    <Eye className="w-4 h-4 mr-3" />
                    Preview Document
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/50 hover:border-slate-300/50 transition-all duration-200"
                    onClick={() => setShowApplicantForm(!showApplicantForm)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    {draft.applicantDetails ? "Edit" : "Add"} Details
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/50 hover:border-slate-300/50 transition-all duration-200"
                    onClick={() => setShowSignature(!showSignature)}
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    {signature ? "Edit" : "Add"} Signature
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/50 hover:border-slate-300/50 transition-all duration-200"
                    onClick={() => handleExport('pdf')}
                    disabled={!draft.content.trim()}
                  >
                    <Download className="w-4 h-4 mr-3" />
                    Export PDF
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/50 hover:border-slate-300/50 transition-all duration-200"
                    onClick={() => handleExport('word')}
                    disabled={!draft.content.trim()}
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    Export Word
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200/50 hover:border-slate-300/50 transition-all duration-200"
                    onClick={handleShare}
                    disabled={!draft.content.trim()}
                  >
                    <Share2 className="w-4 h-4 mr-3" />
                    Share
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Language Settings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/50 pb-4">
                  <CardTitle className="text-lg font-light text-slate-900 flex items-center">
                    <Languages className="w-4 h-4 mr-2" />
                    Language
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="border-slate-200 focus:border-indigo-300 focus:ring-indigo-200 bg-slate-50/50 rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी</SelectItem>
                      <SelectItem value="bn">বাংলা</SelectItem>
                      <SelectItem value="ta">தமிழ்</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </motion.div>

            {/* Compliance Check */}
            {draft.content && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-xl overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/50 pb-4">
                    <CardTitle className="text-lg font-light text-slate-900">Compliance</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 font-light">Quality Score</span>
                        <Badge 
                          variant={compliance.score >= 80 ? "default" : "destructive"}
                          className="bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                        >
                          {compliance.score}%
                        </Badge>
                      </div>
                      
                      {compliance.issues.map((issue, index) => (
                        <div key={index} className="flex items-start space-x-3 text-sm">
                          <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-600 font-light leading-relaxed">{issue}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Applicant Details Modal */}
        {showApplicantForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-medium text-gray-900 mb-6">Applicant Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <Input
                    value={applicantData.name}
                    onChange={(e) => setApplicantData({ ...applicantData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={applicantData.email}
                    onChange={(e) => setApplicantData({ ...applicantData, email: e.target.value })}
                    placeholder="Enter your email address"
                    className="border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
                  <Input
                    value={applicantData.contact}
                    onChange={(e) => setApplicantData({ ...applicantData, contact: e.target.value })}
                    placeholder="Enter your contact number"
                    className="border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-md"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <Textarea
                    value={applicantData.address}
                    onChange={(e) => setApplicantData({ ...applicantData, address: e.target.value })}
                    placeholder="Enter your complete address"
                    className="border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-md resize-none"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowApplicantForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveApplicantDetails}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Save Details
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Signature Modal */}
        {showSignature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSignature(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Digital Signature</h3>
              <SignaturePad 
                onSignatureChange={setSignature}
                className="mb-4"
              />
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowSignature(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => setShowSignature(false)}
                  className="flex-1 bg-gray-900 hover:bg-gray-800"
                  disabled={!signature}
                >
                  Save Signature
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Document Preview Modal */}
        <DocumentPreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          content={draft.content}
          applicantDetails={draft.applicantDetails}
          signature={signature}
        />
      </div>
    </section>
  );
}