import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Focus from '@tiptap/extension-focus';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { validateRTICompliance, exportToPDF, exportToWord } from "@/lib/utils";
import { useRTIStore } from "@/hooks/use-rti-store";
import { useDepartments } from "@/hooks/use-departments";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

// Import all the extracted components
import { ComposerModeSelection } from "../features/rti-composer/composer-mode-selection";
import { GenerateMode } from "../features/rti-composer/generate-mode";
import { ManualMode } from "../features/rti-composer/manual-mode";
import { CombinedMode } from "../features/rti-composer/combined-mode";
import { FinalizeSection } from "../features/rti-composer/finalize-section";
import { ActionsSection } from "../features/rti-composer/actions-section";
import { ComplianceSection } from "../features/rti-composer/compliance-section";
import { ApplicantDetailsDialog } from "../features/rti-composer/applicant-details-dialog";
import { SignatureDialog } from "../features/rti-composer/signature-dialog";
import { PreviewDialog } from "../features/rti-composer/preview-dialog";
import { ComposerMode, ApplicantData } from "../features/rti-composer/types";

// Import new enhanced components
import { EditorToolbar } from "../features/rti-composer/editor-toolbar";
import { LegalAssistantModal } from "../features/rti-composer/legal-assistant-modal";

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
  const [applicantData, setApplicantData] = useState<ApplicantData>({
    name: draft.applicantDetails?.name || "",
    email: draft.applicantDetails?.email || "",
    contact: draft.applicantDetails?.contact || "",
    address: draft.applicantDetails?.address || ""
  });


  // Load persisted signature and applicant details on component mount
  useEffect(() => {
    const savedSignature = localStorage.getItem('rti-signature');
    if (savedSignature) {
      setSignature(savedSignature);
    }

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
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
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

  // Event Handlers
  const handleSaveApplicantDetails = (data: ApplicantData) => {
    setApplicantData(data);
    setApplicantDetails({
      name: data.name || "",
      email: data.email || "",
      contact: data.contact || "",
      address: data.address || ""
    });
    localStorage.setItem('rti-applicant-details', JSON.stringify(data));
    toast.success("Details Saved", {
      description: "Your applicant details have been updated.",
    });
  };

  const handleSaveSignature = (newSignature: string) => {
    setSignature(newSignature);
    localStorage.setItem('rti-signature', newSignature);
    toast.success("Signature Saved", {
      description: "Your signature has been added to the application.",
    });
  };

  const handleVoiceTranscript = (transcript: string) => {
    updateDraft({ query: transcript });
  };

  // Insert text function for legal components
  const handleInsertText = (text: string) => {
    if (editor) {
      editor.chain().focus().insertContent(text).run();
    }
  };

  const handleGenerateRTI = async () => {
    if (!draft.query.trim() || !draft.departmentId) {
      toast.error("Information Missing", {
        description: "Please provide your query and select a department.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const departmentName = departments.find(d => d.id === draft.departmentId)?.name || "[Department Name]";
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

      toast.success("RTI Generated Successfully", {
        description: "Your RTI application has been created with your personal details.",
      });
    } catch (error) {
      toast.error("Generation Failed", {
        description: "Unable to generate RTI. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'word') => {
    if (!draft.content.trim()) {
      toast.error("No content to export", { description: "Please create RTI content first." });
      return;
    }

    try {
      const fileName = `RTI_Application_${(draft.applicantDetails?.name || applicantData.name)?.replace(/\s+/g, '_') || 'Document'}_${new Date().toISOString().split('T')[0]}`;
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

      toast.success(`RTI exported as ${format.toUpperCase()}`, { description: "Professional document generated successfully" });
    } catch (error) {
      toast.error("Export Failed", {
        description: `Failed to export as ${format.toUpperCase()}. Please try again.`,
      });
    }
  };

  const handleShare = () => {
    if (!draft.content.trim()) {
      toast.error("No content to share", { description: "Please create RTI content first." });
      return;
    }
    navigator.clipboard.writeText(draft.content);
    toast.success("RTI content copied to clipboard");
  };

  // Computed values
  const compliance = validateRTICompliance(draft.content);
  const wordCount = editor?.storage.characterCount.words() || 0;
  const departmentName = departments.find(d => d.id === draft.departmentId)?.name || "[Department Name]";

  return (
    <section id="composer" className="py-16 md:py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 lg:mb-20"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-gray-900 mb-4 md:mb-6 tracking-tight">RTI Composer</h2>
          <p className="text-lg sm:text-xl font-light text-gray-500 max-w-2xl mx-auto px-4">
            Create professional RTI applications with AI assistance or manual composition
          </p>
        </motion.div>

        {/* Composer Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 md:mb-16"
        >
          <ComposerModeSelection mode={composerMode} onModeChange={setComposerMode} />
        </motion.div>

        {/* Application Setup - Mobile Only (between tabs and editor) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="lg:hidden mb-4"
        >
          <FinalizeSection
            applicantData={applicantData}
            signature={signature || null}
            onShowApplicantForm={() => setShowApplicantForm(true)}
            onShowSignature={() => setShowSignature(true)}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12">
          {/* Main Composer Area */}
          <div className="lg:col-span-3 order-1">
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardContent className="p-0">
                <Tabs value={composerMode} className="w-full">
                  {/* AI Generation Mode */}
                  <TabsContent value="generate" className="mt-0">
                    <GenerateMode
                      query={draft.query}
                      departmentId={draft.departmentId}
                      departments={departments}
                      departmentsLoading={departmentsLoading}
                      departmentsError={departmentsError}
                      isGenerating={isGenerating}
                      generatedContent={generatedContent}
                      applicantData={applicantData}
                      editor={editor}
                      wordCount={wordCount}
                      onQueryChange={(query) => updateDraft({ query })}
                      onDepartmentChange={(departmentId) => updateDraft({ departmentId })}
                      onVoiceTranscript={handleVoiceTranscript}
                      onGenerate={handleGenerateRTI}
                      onPreview={() => setShowPreview(true)}
                    />
                  </TabsContent>

                  {/* Manual Writing Mode */}
                  <TabsContent value="manual" className="mt-0">
                    <ManualMode editor={editor} wordCount={wordCount} />
                  </TabsContent>

                  {/* Combined Mode */}
                  <TabsContent value="combined" className="mt-0">
                    <CombinedMode
                      query={draft.query}
                      departmentId={draft.departmentId}
                      departments={departments}
                      departmentsLoading={departmentsLoading}
                      departmentsError={departmentsError}
                      isGenerating={isGenerating}
                      applicantData={applicantData}
                      editor={editor}
                      wordCount={wordCount}
                      onQueryChange={(query) => updateDraft({ query })}
                      onDepartmentChange={(departmentId) => updateDraft({ departmentId })}
                      onVoiceTranscript={handleVoiceTranscript}
                      onGenerate={handleGenerateRTI}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:col-span-1 order-2 space-y-4 md:space-y-6">
            {/* Application Setup Section - Desktop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <FinalizeSection
                applicantData={applicantData}
                signature={signature || null}
                onShowApplicantForm={() => setShowApplicantForm(true)}
                onShowSignature={() => setShowSignature(true)}
              />
            </motion.div>

            {/* Actions Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ActionsSection
                onPreview={() => setShowPreview(true)}
                onExportPDF={() => handleExport('pdf')}
                onExportWord={() => handleExport('word')}
                onShare={handleShare}
                onInsertText={handleInsertText}
              />
            </motion.div>

            {/* Compliance Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <ComplianceSection compliance={compliance} wordCount={wordCount} />
            </motion.div>
          </div>
        </div>

        {/* Mobile Actions and Compliance - Below Editor */}
        <div className="lg:hidden mt-4 space-y-3">
          {/* Actions Section - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <ActionsSection
              onPreview={() => setShowPreview(true)}
              onExportPDF={() => handleExport('pdf')}
              onExportWord={() => handleExport('word')}
              onShare={handleShare}
              onInsertText={handleInsertText}
            />
          </motion.div>

          {/* Compliance Section - Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <ComplianceSection compliance={compliance} wordCount={wordCount} />
          </motion.div>
        </div>

        {/* Dialogs */}
        <ApplicantDetailsDialog
          open={showApplicantForm}
          onOpenChange={setShowApplicantForm}
          applicantData={applicantData}
          onSave={handleSaveApplicantDetails}
        />

        <SignatureDialog
          open={showSignature}
          onOpenChange={setShowSignature}
          signature={signature}
          onSave={handleSaveSignature}
        />

        <PreviewDialog
          open={showPreview}
          onOpenChange={setShowPreview}
          content={draft.content}
          applicantDetails={draft.applicantDetails || applicantData}
          signature={signature}
          departmentName={departmentName}
        />
      </div>
    </section>
  );
} 