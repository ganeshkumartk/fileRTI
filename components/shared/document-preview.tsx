"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Download, FileText, Share2, Copy, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn, exportToPDF, exportToWord } from "@/lib/utils";

interface DocumentPreviewProps {
  content: string;
  title?: string;
  applicantDetails?: {
    name?: string;
    email?: string;
    contact?: string;
    address?: string;
  };
  signature?: string | null;
  departmentName?: string;
}

export default function DocumentPreview({ 
  content, 
  title = "RTI Application - Untitled",
  applicantDetails,
  signature,
  departmentName = "[Department Name]"
}: DocumentPreviewProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));

  const handleExport = async (format: 'pdf' | 'word') => {
    try {
      const fileName = `RTI_Application_${applicantDetails?.name?.replace(/\s+/g, '_') || 'Document'}_${new Date().toISOString().split('T')[0]}`;
      
      // Create userDetails object with departmentName
      const userDetailsWithDept = {
        ...applicantDetails,
        departmentName: departmentName
      };
      
      if (format === 'pdf') {
        await exportToPDF(content, `${fileName}.pdf`, signature, userDetailsWithDept);
      } else {
        await exportToWord(content, `${fileName}.docx`, signature, userDetailsWithDept);
      }
      
      toast.success(`Export ${format.toUpperCase()} Successful`, {
        description: `Professional RTI document exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast.error("Export Failed", {
        description: `Failed to export as ${format.toUpperCase()}. Please try again.`,
      });
    }
  };

  const handleCopy = () => {
    const formattedContent = formatContentForExport();
    navigator.clipboard.writeText(formattedContent);
    toast.success("Content Copied", {
      description: "Professional RTI application copied to clipboard",
    });
  };

  // Simple content formatting that only adds header and processes signature
  const formatContentForExport = () => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
    
    // Process signature in content - remove HTML tags for plain text
    let processedContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
    if (signature) {
      processedContent = processedContent.replace(/\[Digital Signature\]/gi, '[Signature Attached]');
    }
    
    return `APPLICATION FOR INFORMATION UNDER
RIGHT TO INFORMATION ACT, 2005
(As per Section 6(1) of RTI Act 2005)

${processedContent}

Date: ${currentDate}`;
  };

  // Clean content for preview display with signature processing
  const getDisplayContent = () => {
    let displayContent = content;
    
    // Replace [Digital Signature] with actual signature image if available
    if (signature) {
      const signatureHtml = `<div style="text-align: right; margin: 20px 0;">
        <img src="${signature}" alt="Signature" style="max-width: 200px; max-height: 80px; border: 1px solid #ddd; padding: 5px; background: white;" />
      </div>`;
      displayContent = displayContent.replace(/\[Digital Signature\]/gi, signatureHtml);
    }
    
    return displayContent;
  };

  return (
    <Card className="h-full flex flex-col shadow-lg border border-gray-200">
      {/* Header with Controls */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 md:p-6 border-b bg-gray-50">
        <div className="flex items-center space-x-3">
          <FileText className="h-5 w-5 text-gray-600" />
          <CardTitle className="text-base md:text-lg font-medium text-gray-800 truncate">
            {title}
          </CardTitle>
          </div>
          
        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 border border-gray-200 rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={zoomOut}
                  disabled={zoomLevel <= 0.5}
              className="h-8 w-8 p-0 hover:bg-gray-100"
                >
              <ZoomOut className="h-3 w-3" />
                </Button>
            <span className="text-xs text-gray-600 px-2 min-w-[3rem] text-center">
                  {Math.round(zoomLevel * 100)}%
            </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={zoomIn}
                  disabled={zoomLevel >= 2}
              className="h-8 w-8 p-0 hover:bg-gray-100"
                >
              <ZoomIn className="h-3 w-3" />
                </Button>
              </div>

          {/* Export Actions */}
                  <Button
            variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
            className="h-8 px-2 md:px-3"
              >
            <Download className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">PDF</span>
              </Button>
              
              <Button
            variant="outline"
                size="sm"
                onClick={() => handleExport('word')}
            className="h-8 px-2 md:px-3"
              >
            <Download className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Word</span>
              </Button>
              
              <Button
            variant="outline"
                size="sm"
                onClick={handleCopy}
            className="h-8 px-2 md:px-3"
              >
            <Copy className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Copy</span>
              </Button>
        </div>
      </CardHeader>

      {/* Document Preview */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="h-full flex justify-center bg-gray-100 p-4 md:p-8">
          <motion.div
              className="bg-white shadow-2xl max-w-4xl w-full min-h-full"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.2s ease-in-out'
              }}
            >
              {/* Document Content */}
              <div className="p-8 md:p-12">
                  {/* Document Header - Centered */}
                  <div className="text-center space-y-2 sm:space-y-4 pb-4 sm:pb-6 lg:pb-8 border-b border-gray-200">
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 tracking-tight uppercase leading-tight">
                      Application for Information under<br />
                      Right to Information Act, 2005
                    </h1>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-light text-xs sm:text-sm">
                      As per Section 6(1) of RTI Act 2005
                    </Badge>
                  </div>

                {/* TipTap Content */}
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: getDisplayContent() }}
                          />

                {/* Current Date */}
                <div className="mt-8 pt-4">
                  <p className="text-sm">
                    Date: {new Date().toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                    </p>
                  </div>
                </div>
          </motion.div>
        </div>
      </ScrollArea>
      </CardContent>

      {/* Footer Status */}
      <div className="border-t bg-gray-50 px-4 py-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Ready for Export</span>
            {signature && (
              <Badge variant="secondary" className="text-xs">
                Signature Ready
              </Badge>
            )}
          </div>
          <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
        </div>
    </div>
    </Card>
  );
} 