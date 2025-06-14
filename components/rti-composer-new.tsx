import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Focus from '@tiptap/extension-focus';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Download,
  Share2,
  FileText,
  User,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Eye,
  PenSquare,
  Type,
  Wand2,
  ArrowRight,
  Clock,
  Target,
  Heading1,
  Heading2,
  Quote
} from "lucide-react";
import { validateRTICompliance, exportToPDF, exportToWord } from "@/lib/utils";
import { useRTIStore } from "@/hooks/use-rti-store";
import { useDepartments } from "@/hooks/use-departments";
import { useToast } from "@/hooks/use-toast";
import { VoiceInput } from "@/components/voice-input";
import DocumentPreview from "@/components/document-preview";
import SignaturePad from "@/components/signature-pad";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toggle } from "@/components/ui/toggle";

type ComposerMode = 'manual' | 'generate' | 'combined';

export default function RTIComposer() {
  const { draft, updateDraft, setApplicantDetails } = useRTIStore();
  const { departments, loading: departmentsLoading, error: departmentsError } = useDepartments();
  const [composerMode, setComposerMode] = useState<ComposerMode>('generate');
  const [showApplicantForm, setShowApplicantForm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [applicantData, setApplicantData] = useState({
    name: draft.applicantDetails?.name || "",
    email: draft.applicantDetails?.email || "",
    contact: draft.applicantDetails?.contact || "",
    address: draft.applicantDetails?.address || ""
  });
  const { toast } = useToast();

  // Load persisted signature and applicant details on component mount
  useEffect(() => {
    // Load signature from localStorage
    const savedSignature = localStorage.getItem('rti-signature');
    if (savedSignature) {
      setSignature(savedSignature);
    }

    // Sync applicant data with store
    if (draft.applicantDetails) {
      setApplicantData({
        name: draft.applicantDetails.name || "",
        email: draft.applicantDetails.email || "",
        contact: draft.applicantDetails.contact || "",
        address: draft.applicantDetails.address || ""
      });
    }
  }, [draft.applicantDetails]);

  // Tiptap Editor Configuration
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return "What's the title?"
          }
          return 'Start writing your RTI application or use our AI generator...'
        },
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      Focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
    ],
    content: draft.content || '',
    onUpdate: ({ editor }) => {
      updateDraft({ content: editor.getHTML() });
    },
    editorProps: {
      attributes: {
        class: 'prose prose-gray max-w-none focus:outline-none min-h-[400px] p-6 text-gray-700',
      },
    },
  });

  const handleSaveApplicantDetails = () => {
    setApplicantDetails(applicantData);
    // Also save to localStorage for persistence
    localStorage.setItem('rti-applicant-details', JSON.stringify(applicantData));
    toast({
      title: "Details Saved",
      description: "Your applicant details have been updated.",
    });
    setShowApplicantForm(false);
  };

  const handleSaveSignature = (newSignature: string) => {
    setSignature(newSignature);
    // Save signature to localStorage for persistence
    localStorage.setItem('rti-signature', newSignature);
    toast({
      title: "Signature Saved",
      description: "Your signature has been added to the application.",
    });
    setShowSignature(false);
  };

  const handleVoiceTranscript = (transcript: string) => {
    updateDraft({ query: transcript });
  };

  const handleGenerateRTI = async () => {
    if (!draft.query.trim() || !draft.departmentId) {
        toast({
            title: "Information Missing",
            description: "Please provide your query and select a department.",
            variant: "destructive",
        });
        return;
    }

    setIsGenerating(true);
    
    try {
    const departmentName = departments.find(d => d.id === draft.departmentId)?.name || "[Department Name]";
      
      // Use actual applicant details if available, otherwise use placeholders
      const currentApplicant = draft.applicantDetails || applicantData;
      const applicantName = currentApplicant.name || "[YOUR NAME]";
      const applicantAddress = currentApplicant.address || "[YOUR ADDRESS]";
      const applicantContact = currentApplicant.contact || "[YOUR CONTACT]";
      const applicantEmail = currentApplicant.email || "[YOUR EMAIL]";
      
      const content = `
        <h2>Application for Information under Right to Information Act, 2005</h2>
        
        <p><strong>To:</strong><br>
        The Public Information Officer,<br>
        ${departmentName}</p>
        
        <p><strong>Subject:</strong> Request for Information under RTI Act 2005</p>
        
        <p>Dear Sir/Madam,</p>
        
        <p>I, <strong>${applicantName}</strong>, a citizen of India, hereby request the following information under the Right to Information Act, 2005:</p>
        
        <blockquote>
          <p>${draft.query}</p>
        </blockquote>
        
        <p>I am enclosing the application fee of Rs. 10/- as required under the RTI Act.</p>
        
        <p>Please provide the information within the stipulated time period of 30 days as per the provisions of the Right to Information Act, 2005.</p>
        
        <p>Thank you for your cooperation.</p>
        
        <p>Yours faithfully,<br>
        <strong>${applicantName}</strong><br>
        <strong>${applicantAddress}</strong><br>
        <strong>Contact: ${applicantContact}</strong>${applicantEmail !== "[YOUR EMAIL]" ? `<br><strong>Email: ${applicantEmail}</strong>` : ''}</p>
      `;
      
      setGeneratedContent(content);
      editor?.commands.setContent(content);
      updateDraft({ content });
      
    toast({
        title: "RTI Generated Successfully",
          description: "Your RTI application has been created with your personal details.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Unable to generate RTI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'word') => {
    if (!draft.content.trim()) {
      toast({ title: "No content to export", description: "Please create RTI content first.", variant: "destructive" });
      return;
    }
    
    try {
      const fileName = `RTI_Application_${(draft.applicantDetails?.name || applicantData.name)?.replace(/\s+/g, '_') || 'Document'}_${new Date().toISOString().split('T')[0]}`;
      
      // Include department name in user details
      const departmentName = departments.find(d => d.id === draft.departmentId)?.name || "[Department Name]";
      const userDetailsWithDept = {
        ...(draft.applicantDetails || applicantData),
        departmentName: departmentName
      };
      
      if (format === 'pdf') {
        await exportToPDF(draft.content, `${fileName}.pdf`, signature, userDetailsWithDept);
      } else {
        await exportToWord(draft.content, `${fileName}.docx`, signature, userDetailsWithDept);
      }
      
      toast({ title: `RTI exported as ${format.toUpperCase()}`, description: "Professional document generated successfully" });
    } catch (error) {
      toast({ 
        title: "Export Failed", 
        description: `Failed to export as ${format.toUpperCase()}. Please try again.`,
        variant: "destructive" 
      });
    }
  };

  const handleShare = () => {
    if (!draft.content.trim()) {
      toast({ title: "No content to share", description: "Please create RTI content first.", variant: "destructive" });
      return;
    }
    navigator.clipboard.writeText(draft.content);
    toast({ title: "RTI content copied to clipboard" });
  };

  const compliance = validateRTICompliance(draft.content);
  const wordCount = editor?.storage.characterCount.words() || 0;

  // Editor Toolbar Component
  const EditorToolbar = () => (
    <div className="flex items-center gap-1 p-3 border-b border-gray-200 bg-gray-50/50">
      <div className="flex items-center gap-1">
        <Toggle
          aria-label="Bold"
          pressed={editor?.isActive('bold')}
          onPressedChange={() => editor?.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Italic"
          pressed={editor?.isActive('italic')}
          onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Heading 1"
          pressed={editor?.isActive('heading', { level: 1 })}
          onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className="h-8 w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Heading 2"
          pressed={editor?.isActive('heading', { level: 2 })}
          onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-8 w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Bullet List"
          pressed={editor?.isActive('bulletList')}
          onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Numbered List"
          pressed={editor?.isActive('orderedList')}
          onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Quote"
          pressed={editor?.isActive('blockquote')}
          onPressedChange={() => editor?.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900"
        >
          <Quote className="h-4 w-4" />
        </Toggle>
      </div>
      <Separator orientation="vertical" className="h-6 mx-2" />
      <div className="text-xs text-gray-500 font-light">
        {wordCount} words
      </div>
    </div>
  );

  return (
    <section id="composer" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6 }} 
          className="text-center mb-20"
        >
          <h2 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">RTI Composer</h2>
          <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto">
            Create professional RTI applications with AI assistance or manual composition
          </p>
        </motion.div>

        {/* Composer Mode Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          transition={{ duration: 0.6, delay: 0.1 }} 
          className="mb-16"
        >
          <Tabs value={composerMode} onValueChange={(value) => setComposerMode(value as ComposerMode)} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-gray-100 p-1 rounded-full h-12">
              <TabsTrigger 
                value="generate" 
                className="rounded-full font-light text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                AI Generate
              </TabsTrigger>
              <TabsTrigger 
                value="manual" 
                className="rounded-full font-light text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                <Type className="w-4 h-4 mr-2" />
                Manual Write
              </TabsTrigger>
              <TabsTrigger 
                value="combined" 
                className="rounded-full font-light text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
              >
                <Target className="w-4 h-4 mr-2" />
                Combined
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Composer Area */}
          <div className="lg:col-span-3">
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardContent className="p-0">
                <Tabs value={composerMode} className="w-full">
                  {/* AI Generation Mode */}
                  <TabsContent value="generate" className="mt-0">
                    <div className="p-8 space-y-8">
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Wand2 className="w-6 h-6 text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-light text-gray-900 mb-3">AI-Powered Generation</h3>
                        <p className="text-gray-500 font-light max-w-md mx-auto">
                          Describe what information you need, and we'll create a professional RTI application
                        </p>
                </div>

                      <div className="space-y-6">
                <div>
                          <Label className="text-sm font-medium text-gray-900 mb-3 block">
                            What information do you need?
                          </Label>
                  <div className="relative">
                            <Textarea 
                              placeholder="Describe the specific government information you're seeking..." 
                              value={draft.query} 
                              onChange={(e) => updateDraft({ query: e.target.value })} 
                              className="pr-14 min-h-[120px] resize-none border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 rounded-xl"
                              rows={4}
                            />
                            <div className="absolute top-4 right-4">
                              <VoiceInput onTranscript={handleVoiceTranscript} />
                            </div>
                  </div>
                </div>
                        
                <div>
                          <Label className="text-sm font-medium text-gray-900 mb-3 block">
                            Government Department
                          </Label>
                  <Select value={draft.departmentId} onValueChange={(value) => updateDraft({ departmentId: value })}>
                            <SelectTrigger className="border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 rounded-xl h-12">
                              <SelectValue placeholder={departmentsLoading ? "Loading departments..." : "Select a department"} />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {departmentsError && (
                                <SelectItem value="error" disabled>
                                  Failed to load departments
                                </SelectItem>
                              )}
                              {departments.map(dept => (
                                <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                              ))}
                    </SelectContent>
                  </Select>
                </div>
                        
                        <Button 
                          onClick={handleGenerateRTI} 
                          disabled={isGenerating || !draft.query.trim() || !draft.departmentId}
                          className="w-full h-14 text-base bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-light"
                        >
                          {isGenerating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent mr-3" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 mr-3" />
                              Generate RTI Application
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Generated Content Preview */}
                      {generatedContent && (
                        <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                            <Label className="text-sm font-medium text-gray-900">Generated RTI Application</Label>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setShowPreview(true)}
                              className="rounded-lg hover:bg-gray-900 hover:text-gray-50"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Preview
                            </Button>
                          </div>
                          <Card className="border border-gray-200">
                            <CardContent className="p-0">
                              <EditorToolbar />
                              <div className="border-0 rounded-b-xl min-h-[400px] focus-within:ring-1 focus-within:ring-gray-400 transition-all">
                                <EditorContent editor={editor} />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* Manual Writing Mode */}
                  <TabsContent value="manual" className="mt-0">
                    <div className="p-8">
                      <div className="text-center py-8 mb-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Type className="w-6 h-6 text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-light text-gray-900 mb-3">Manual Composition</h3>
                        <p className="text-gray-500 font-light max-w-md mx-auto">
                          Write your RTI application from scratch with our rich text editor
                        </p>
                  </div>

                      {/* Tiptap Editor */}
                      <Card className="border border-gray-200">
                        <CardContent className="p-0">
                          <EditorToolbar />
                          <div className="border-0 rounded-b-xl min-h-[500px] focus-within:ring-1 focus-within:ring-gray-400 transition-all">
                            <EditorContent editor={editor} />
                </div>
              </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  {/* Combined Mode */}
                  <TabsContent value="combined" className="mt-0">
                    <div className="p-8 space-y-8">
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Target className="w-6 h-6 text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-light text-gray-900 mb-3">Combined Approach</h3>
                        <p className="text-gray-500 font-light max-w-md mx-auto">
                          Generate a base RTI application and then customize it manually
                        </p>
                      </div>

                      {/* Generation Section */}
                      <Card className="border border-gray-200 bg-gray-50/50">
                        <CardContent className="p-6 space-y-6">
                          <h4 className="font-medium text-gray-900">Step 1: Generate Base Content</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-900 mb-2 block">
                                Information Request
                              </Label>
                              <div className="relative">
                                <Textarea 
                                  placeholder="What information do you need?" 
                                  value={draft.query} 
                                  onChange={(e) => updateDraft({ query: e.target.value })} 
                                  className="pr-12 border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 rounded-xl"
                                  rows={3}
                                />
                                <div className="absolute top-3 right-3">
                                  <VoiceInput onTranscript={handleVoiceTranscript} />
                                </div>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-900 mb-2 block">
                                Department
                              </Label>
                              <Select value={draft.departmentId} onValueChange={(value) => updateDraft({ departmentId: value })}>
                                <SelectTrigger className="border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 rounded-xl">
                                  <SelectValue placeholder={departmentsLoading ? "Loading departments..." : "Select department"} />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                  {departmentsError && (
                                    <SelectItem value="error" disabled>
                                      Failed to load departments
                                    </SelectItem>
                                  )}
                                  {departments.map(dept => (
                                    <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <Button 
                            onClick={handleGenerateRTI} 
                            disabled={isGenerating || !draft.query.trim() || !draft.departmentId}
                            className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-light"
                          >
                            {isGenerating ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent mr-2" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Wand2 className="w-4 h-4 mr-2" />
                                Generate Base Content
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Manual Editing Section */}
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-gray-900">Step 2: Customize & Edit</h4>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>

                        {/* Tiptap Editor */}
                        <Card className="border border-gray-200">
                          <CardContent className="p-0">
                            <EditorToolbar />
                            <div className="border-0 rounded-b-xl min-h-[400px] focus-within:ring-1 focus-within:ring-gray-400 transition-all">
                              <EditorContent editor={editor} />
                  </div>
                          </CardContent>
                        </Card>
                  </div>
                </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Finalize Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 font-light text-lg">
                    <User className="w-5 h-5 text-gray-600" />
                    <span>Finalize Application</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowApplicantForm(true)} 
                    className="w-full justify-start hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light border-gray-200"
                  >
                    <User className="w-4 h-4 mr-3" />
                    {(draft.applicantDetails?.name || applicantData.name) ? "Edit Details" : "Add Your Details"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSignature(true)} 
                    className="w-full justify-start hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light border-gray-200"
                  >
                    <PenSquare className="w-4 h-4 mr-3" />
                    {signature ? "Change Signature" : "Add Signature"}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Actions Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 font-light text-lg">
                    <Download className="w-5 h-5 text-gray-600" />
                    <span>Actions</span>
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light" 
                    variant="outline" 
                    onClick={() => setShowPreview(true)}
                  >
                    <Eye className="w-4 h-4 mr-3" />
                    Preview Application
                  </Button>
                <Separator />
                  <Button 
                    className="w-full justify-start hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light" 
                    variant="ghost" 
                    onClick={() => handleExport('pdf')}
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    Export as PDF
                  </Button>
                  <Button 
                    className="w-full justify-start hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light" 
                    variant="ghost" 
                    onClick={() => handleExport('word')}
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    Export as Word
                  </Button>
                  <Button 
                    className="w-full justify-start hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light" 
                    variant="ghost" 
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-3" />
                    Copy to Clipboard
                  </Button>
              </CardContent>
            </Card>
            </motion.div>
            
            {/* Compliance Check */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-3 font-light text-lg">
                    <CheckCircle2 className="w-5 h-5 text-gray-600" />
                    <span>Compliance</span>
                  </CardTitle>
                </CardHeader>
              <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-sm">Score</span>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-900 font-light">
                      {compliance.score}%
                    </Badge>
                  </div>
                  <ul className="space-y-2">
                    {compliance.issues.map((issue, i) => (
                      <li key={i} className="flex items-start space-x-2 text-xs">
                        <AlertTriangle className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600 font-light">{issue}</span>
                      </li>
                    ))}
                    {compliance.issues.length === 0 && (
                      <div className="text-xs text-gray-700 flex items-center space-x-2 font-light">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>All requirements met</span>
                      </div>
                    )}
                </ul>
              </CardContent>
            </Card>
            </motion.div>

            {/* Progress Indicator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="border border-gray-200 shadow-sm bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 text-xs text-gray-600 font-light">
                    <Clock className="w-4 h-4" />
                    <span>Auto-saved • {wordCount} words</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Dialogs */}
        <Dialog open={showApplicantForm} onOpenChange={setShowApplicantForm}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-light text-xl">Your Personal Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input 
                  id="name" 
                  value={applicantData.name} 
                  onChange={(e) => setApplicantData({...applicantData, name: e.target.value})} 
                  className="rounded-xl border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={applicantData.email} 
                  onChange={(e) => setApplicantData({...applicantData, email: e.target.value})} 
                  className="rounded-xl border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact" className="text-sm font-medium">Contact Number</Label>
                <Input 
                  id="contact" 
                  value={applicantData.contact} 
                  onChange={(e) => setApplicantData({...applicantData, contact: e.target.value})} 
                  className="rounded-xl border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <Textarea 
                  id="address" 
                  value={applicantData.address} 
                  onChange={(e) => setApplicantData({...applicantData, address: e.target.value})} 
                  className="rounded-xl border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSaveApplicantDetails} className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-light">
                Save Details
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showSignature} onOpenChange={setShowSignature}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-light text-xl">Digital Signature</DialogTitle>
            </DialogHeader>
            <SignaturePad onSignature={handleSaveSignature} existingSignature={signature} />
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setShowSignature(false)} className="hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light border-gray-200">
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
            <DialogHeader className="sr-only">
              <DialogTitle>RTI Application Preview</DialogTitle>
            </DialogHeader>
            <DocumentPreview 
              content={draft.content}
              title={`RTI Application - ${(draft.applicantDetails?.name || applicantData.name) || 'Untitled'}`}
              applicantDetails={draft.applicantDetails || applicantData}
              signature={signature}
              departmentName={departments.find(d => d.id === draft.departmentId)?.name || "[Department Name]"}
            />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
} 