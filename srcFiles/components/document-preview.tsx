import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ZoomOut, Download, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRTIStore } from "@/hooks/use-rti-store";
import { formatRTIContent, exportToPDF, exportToWord } from "@/lib/utils";

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  applicantDetails?: any;
  signature?: string | null;
}

export default function DocumentPreview({ 
  isOpen, 
  onClose, 
  content, 
  applicantDetails,
  signature 
}: DocumentPreviewProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const { draft } = useRTIStore();

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));

  const formattedContent = formatRTIContent(content, applicantDetails);

  const handleExport = (format: 'pdf' | 'word') => {
    if (format === 'pdf') {
      exportToPDF(formattedContent, `rti-application-${Date.now()}.pdf`, signature);
    } else {
      exportToWord(formattedContent, `rti-application-${Date.now()}.docx`, signature);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(formattedContent);
    // Could add toast notification here
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-light text-slate-900 mb-1">Document Preview</h2>
                  <p className="text-sm text-slate-500 font-light">RTI Application - {draft.title || 'Untitled'}</p>
                </div>
                
                <div className="flex items-center space-x-3">
                  {/* Zoom Controls */}
                  <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/50 p-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={zoomOut}
                      disabled={zoomLevel <= 0.5}
                      className="h-8 w-8 p-0 hover:bg-slate-100"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-slate-600 font-medium min-w-[3rem] text-center">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={zoomIn}
                      disabled={zoomLevel >= 2}
                      className="h-8 w-8 p-0 hover:bg-slate-100"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExport('pdf')}
                      className="h-9 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleExport('word')}
                      className="h-9 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/50"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Word
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleShare}
                      className="h-9 px-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/50"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-9 w-9 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Document Content */}
            <div className="p-6 overflow-auto max-h-[calc(90vh-140px)] bg-slate-50/30">
              <motion.div
                animate={{ scale: zoomLevel }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="origin-top-left"
              >
                <div className="bg-white shadow-lg rounded-lg p-8 mx-auto max-w-2xl border border-slate-200/50">
                  {/* Document Header */}
                  <div className="text-center mb-8 border-b border-slate-200 pb-6">
                    <h3 className="text-xl font-medium text-slate-900 mb-2">
                      Right to Information Application
                    </h3>
                    <p className="text-sm text-slate-500">
                      As per RTI Act 2005, Section 6(1)
                    </p>
                  </div>

                  {/* Applicant Details */}
                  {applicantDetails && (
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-slate-900 mb-3">Applicant Details</h4>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Name:</span>
                          <span className="ml-2 text-slate-900">{applicantDetails.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Contact:</span>
                          <span className="ml-2 text-slate-900">{applicantDetails.contact}</span>
                        </div>
                        {applicantDetails.email && (
                          <div>
                            <span className="text-slate-600">Email:</span>
                            <span className="ml-2 text-slate-900">{applicantDetails.email}</span>
                          </div>
                        )}
                        {applicantDetails.address && (
                          <div className="md:col-span-2">
                            <span className="text-slate-600">Address:</span>
                            <span className="ml-2 text-slate-900">{applicantDetails.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Application Title */}
                  {draft.title && (
                    <div className="mb-6">
                      <h4 className="text-lg font-medium text-slate-900 mb-2">Subject</h4>
                      <p className="text-slate-800">{draft.title}</p>
                    </div>
                  )}

                  {/* Application Content */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium text-slate-900 mb-3">Application Details</h4>
                    <div 
                      className="prose prose-slate max-w-none text-slate-800 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: formattedContent.replace(/\n/g, '<br/>') }}
                    />
                  </div>

                  {/* Signature Section */}
                  <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-end">
                    <div className="text-sm text-slate-600">
                      <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
                      <p className="mt-2">Place: _________________</p>
                    </div>
                    <div className="text-center">
                      {signature ? (
                        <div className="mb-2">
                          <img 
                            src={signature} 
                            alt="Digital Signature" 
                            className="h-16 w-auto border border-slate-200 rounded"
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-48 border-b border-slate-400 mb-2"></div>
                      )}
                      <p className="text-sm text-slate-600">Applicant Signature</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 text-xs text-slate-500 text-center">
                    This application is generated using FileRTI platform in compliance with RTI Act 2005.
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}