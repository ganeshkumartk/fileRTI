"use client"

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ZoomIn, ZoomOut, Download, FileText, Share2, Copy, Eye, MapPin, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  const [userLocation, setUserLocation] = useState<string>("");
  const [customPlace, setCustomPlace] = useState<string>("");
  const [showPlace, setShowPlace] = useState<boolean>(true);
  const [showPlaceSettings, setShowPlaceSettings] = useState<boolean>(false);


  // Get user location from IP
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        setUserLocation(data.city || data.region || "New Delhi");
      } catch (error) {
        setUserLocation("New Delhi");
      }
    };
    fetchLocation();
  }, []);

  const zoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2));
  const zoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));

  const handleExport = async (format: 'pdf' | 'word') => {
    try {
      const fileName = `RTI_Application_${applicantDetails?.name?.replace(/\s+/g, '_') || 'Document'}_${new Date().toISOString().split('T')[0]}`;
      const place = showPlace ? (customPlace || userLocation) : "";
      
      // Create userDetails object with departmentName
      const userDetailsWithDept = {
        ...applicantDetails,
        departmentName: departmentName
      };
      
      if (format === 'pdf') {
        await exportToPDF(content, `${fileName}.pdf`, signature, userDetailsWithDept, place);
      } else {
        await exportToWord(content, `${fileName}.docx`, signature, userDetailsWithDept, place);
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



  const cleanContentForDisplay = (rawContent: string) => {
    // First, remove standard RTI texts from HTML content (including their HTML tags)
    let htmlContent = rawContent;
    
    const standardTextsToRemove = [
      'I am enclosing the application fee of Rs. 10/- as required under the RTI Act.',
      'Please provide the information within the stipulated time period of 30 days as per the provisions of the Right to Information Act, 2005.',
      'Thank you for your cooperation.',
      'Yours faithfully,',
      'Dear Sir/Madam,',
      'Respected Sir/Madam,',
      departmentName || '[Department Name]',
      'To,',
      'To:',
      'The Public Information Officer,',
      'Subject: Request for Information under RTI Act 2005',
      'Subject:',
      'Request for Information under RTI Act 2005',
      `I, ${applicantDetails?.name || '[Your Name]'}, a citizen of India, hereby request the following information under the Right to Information Act, 2005:`,
      'I, , a citizen of India, hereby request the following information under the :',
      'I, , a citizen of India, hereby request the following information under the',
      'a citizen of India, hereby request the following information under the',
      'hereby request the following information under the',
      'citizen of India, hereby request the following information',
      'APPLICATION FOR INFORMATION UNDER',
      'RIGHT TO INFORMATION ACT, 2005',
      '(As per Section 6(1) of RTI Act 2005)',
      // Remove user details to prevent duplication
      applicantDetails?.name || '',
      applicantDetails?.address || '',
      applicantDetails?.contact || '',
      applicantDetails?.email || '',
      `Address: ${applicantDetails?.address || ''}`,
      `Contact: ${applicantDetails?.contact || ''}`,
      `Email: ${applicantDetails?.email || ''}`,
      'Contact:',
      'Email:',
      'Address:',
      'I, , :'
    ];
    
    // Remove each standard text from HTML (including HTML tags that contain only these texts)
    standardTextsToRemove.forEach(text => {
      if (text && text.trim()) {
        const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Remove HTML elements that contain only this text (with optional whitespace and line breaks)
        const htmlTagRegex = new RegExp(`<[^>]*>\\s*${escapedText}\\s*<\\/[^>]*>`, 'gi');
        htmlContent = htmlContent.replace(htmlTagRegex, '');
        
        // Remove HTML paragraphs, divs, spans that contain this text
        const pTagRegex = new RegExp(`<p[^>]*>\\s*${escapedText}\\s*<\\/p>`, 'gi');
        const divTagRegex = new RegExp(`<div[^>]*>\\s*${escapedText}\\s*<\\/div>`, 'gi');
        const spanTagRegex = new RegExp(`<span[^>]*>\\s*${escapedText}\\s*<\\/span>`, 'gi');
        
        htmlContent = htmlContent.replace(pTagRegex, '');
        htmlContent = htmlContent.replace(divTagRegex, '');
        htmlContent = htmlContent.replace(spanTagRegex, '');
        
        // Remove the text itself (case insensitive)
        const textRegex = new RegExp(escapedText, 'gi');
        htmlContent = htmlContent.replace(textRegex, '');
      }
    });
    
    // Remove empty HTML tags that might be left behind
    htmlContent = htmlContent.replace(/<([^>]+)>\s*<\/\1>/gi, '');
    htmlContent = htmlContent.replace(/<p>\s*<\/p>/gi, '');
    htmlContent = htmlContent.replace(/<div>\s*<\/div>/gi, '');
    htmlContent = htmlContent.replace(/<span>\s*<\/span>/gi, '');
    // Remove ALL br tags completely
    htmlContent = htmlContent.replace(/<br\s*\/?>/gi, ''); // Remove all br tags
    
    // Remove additional patterns with regex
    htmlContent = htmlContent.replace(/Subject:\s*Request for Information under RTI Act 2005/gi, '');
    htmlContent = htmlContent.replace(/Subject:\s*/gi, '');
    htmlContent = htmlContent.replace(/I,\s*,?\s*a citizen of India,?\s*hereby request the following information under the\s*:?/gi, '');
    htmlContent = htmlContent.replace(/I,\s*[^,]*,?\s*a citizen of India,?\s*hereby request the following information under the Right to Information Act,?\s*2005:?/gi, '');
    htmlContent = htmlContent.replace(/a citizen of India,?\s*hereby request the following information/gi, '');
    htmlContent = htmlContent.replace(/hereby request the following information under/gi, '');
    htmlContent = htmlContent.replace(/citizen of India,?\s*hereby request/gi, '');
    
    // Remove malformed patterns that occur with place/date processing
    htmlContent = htmlContent.replace(/I,\s*,\s*:/gi, '');
    htmlContent = htmlContent.replace(/I,\s*,\s*$/gi, '');
    htmlContent = htmlContent.replace(/I,\s*:\s*$/gi, '');
    htmlContent = htmlContent.replace(/^,\s*:/gi, '');
    htmlContent = htmlContent.replace(/^:\s*$/gi, '');
    
    // Remove date patterns, place patterns, signature patterns
    htmlContent = htmlContent.replace(/Date:\s*\d{2}\/\d{2}\/\d{4}/gi, '');
    htmlContent = htmlContent.replace(/Place:\s*\[.*?\]/gi, '');
    htmlContent = htmlContent.replace(/Place:\s*\w+/gi, '');
    htmlContent = htmlContent.replace(/\(Digital Signature Attached\)/gi, '');
    htmlContent = htmlContent.replace(/\(Signature\)/gi, '');
    
    // Clean up extra whitespace and line breaks
    htmlContent = htmlContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
    
    return htmlContent;
  };

  const formatContentForExport = () => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
    
    const place = showPlace ? (customPlace || userLocation) : "";
    const cleanedContent = cleanContentForDisplay(content);
    
    let formattedContent = `
APPLICATION FOR INFORMATION UNDER RIGHT TO INFORMATION ACT, 2005

To,
The Public Information Officer,
${departmentName}

Subject: Request for Information under RTI Act 2005

Dear Sir/Madam,

I, ${applicantDetails?.name || '[Your Name]'}, a citizen of India, hereby request the following information under the Right to Information Act, 2005:

${cleanedContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ')}

I am enclosing the application fee of Rs. 10/- as required under the RTI Act.

Please provide the information within the stipulated time period of 30 days as per the provisions of the Right to Information Act, 2005.

Thank you for your cooperation.

Yours faithfully,

${applicantDetails?.name || '[Your Name]'}
${applicantDetails?.address || '[Your Address]'}
Contact: ${applicantDetails?.contact || '[Your Contact]'}
${applicantDetails?.email ? `Email: ${applicantDetails.email}` : ''}

Date: ${currentDate}
${place ? `Place: ${place}` : ''}
    `;
    
    return formattedContent.trim();
  };

  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Ultra-Premium Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-light text-gray-900 tracking-tight">Document Preview</h2>
            <p className="text-sm text-gray-500 font-light">{title}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Zoom Controls */}
            <div className="flex items-center border border-gray-200 rounded-md bg-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomOut}
                disabled={zoomLevel <= 0.5}
                className="h-9 w-9 p-0 hover:bg-black hover:text-white text-gray-600 rounded-l-md rounded-r-none border-r border-gray-200"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="px-3 py-1 bg-gray-50 text-gray-900 font-light min-w-[3rem] text-center text-sm">
                {Math.round(zoomLevel * 100)}%
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={zoomIn}
                disabled={zoomLevel >= 2}
                className="h-9 w-9 p-0 hover:bg-black hover:text-white text-gray-600 rounded-r-md rounded-l-none border-l border-gray-200"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Place Settings */}
            <Dialog open={showPlaceSettings} onOpenChange={setShowPlaceSettings}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 text-gray-600 hover:text-white hover:bg-black border-gray-200"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Place
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-light text-xl">Place Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-place" className="text-sm font-medium">Show Place in Document</Label>
                    <Switch
                      id="show-place"
                      checked={showPlace}
                      onCheckedChange={setShowPlace}
                    />
                  </div>
                  {showPlace && (
                    <div className="space-y-2">
                      <Label htmlFor="place" className="text-sm font-medium">
                        Place (Auto-detected - {userLocation})
                      </Label>
                      <Input
                        id="place"
                        placeholder={userLocation}
                        value={customPlace}
                        onChange={(e) => setCustomPlace(e.target.value)}
                        className="rounded-xl border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
                      />
                      <p className="text-xs text-gray-500">Leave empty to use auto-detected location</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('pdf')}
                className="h-9 px-3 text-gray-600 hover:text-white hover:bg-black border-gray-200"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('word')}
                className="h-9 px-3 text-gray-600 hover:text-white hover:bg-black border-gray-200"
              >
                <FileText className="h-4 w-4 mr-2" />
                Word
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-9 px-3 text-gray-600 hover:text-white hover:bg-black border-gray-200"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Document Content */}
      <ScrollArea className="flex-1 bg-gray-50/30">
        <div className="p-8">
          <motion.div
            animate={{ scale: zoomLevel }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="origin-top-left"
          >
            <Card className="bg-white shadow-xl border-gray-200 mx-auto max-w-4xl">
              <CardContent className="p-12">
                {/* Professional RTI Document */}
                <div id="document-content" className="space-y-8">
                  {/* Document Header - Centered */}
                  <div className="text-center space-y-4 pb-8 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight uppercase">
                      Application for Information under<br />
                      Right to Information Act, 2005
                    </h1>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 font-light">
                      As per Section 6(1) of RTI Act 2005
                    </Badge>
                  </div>

                  {/* Application Content */}
                  <div className="space-y-6 text-gray-800 leading-relaxed">
                    {/* To Section */}
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">To,</p>
                      <div className="pl-4 space-y-1 text-gray-800">
                        <p>The Public Information Officer,</p>
                        <p className="font-medium">{departmentName}</p>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <p><span className="font-semibold text-gray-900">Subject:</span> Request for Information under RTI Act 2005</p>
                    </div>

                    {/* Salutation */}
                    <p className="font-medium">Dear Sir/Madam,</p>

                    {/* Main Content */}
                    <div className="space-y-4">
                      <p className="text-justify">
                        I, <span className="font-semibold">{applicantDetails?.name || '[Your Name]'}</span>, 
                        a citizen of India, hereby request the following information under the Right to Information Act, 2005:
                      </p>

                      {/* Information Request - Highlighted */}
                      <Card className="border-l-4 border-gray-400 bg-gray-50/50">
                        <CardContent className="p-4">
                          <div 
                            className="text-gray-800 leading-relaxed prose prose-gray max-w-none"
                            dangerouslySetInnerHTML={{ 
                              __html: cleanContentForDisplay(content).replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/\n+/g, ' ') || "Please add your information request in the composer."
                            }}
                          />
                        </CardContent>
                      </Card>

                      {/* Standard RTI Text */}
                      <div className="space-y-4 text-justify">
                        <p>I am enclosing the application fee of Rs. 10/- as required under the RTI Act.</p>
                        <p>Please provide the information within the stipulated time period of 30 days as per the provisions of the Right to Information Act, 2005.</p>
                        <p>Thank you for your cooperation.</p>
                      </div>
                    </div>
                  </div>

                  {/* Applicant Details Section */}
                  {applicantDetails && (
                    <Card className="border-gray-200 bg-gray-50/30">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-semibold text-gray-900">Applicant Details</CardTitle>
      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          {applicantDetails.name && (
                            <div className="flex">
                              <span className="text-gray-600 font-medium min-w-[80px]">Name:</span>
                              <span className="text-gray-900">{applicantDetails.name}</span>
                            </div>
                          )}
                          {applicantDetails.contact && (
                            <div className="flex">
                              <span className="text-gray-600 font-medium min-w-[80px]">Contact:</span>
                              <span className="text-gray-900">{applicantDetails.contact}</span>
                            </div>
                          )}
                          {applicantDetails.email && (
                            <div className="flex">
                              <span className="text-gray-600 font-medium min-w-[80px]">Email:</span>
                              <span className="text-gray-900">{applicantDetails.email}</span>
                            </div>
                          )}
                          {applicantDetails.address && (
                            <div className="md:col-span-2 flex">
                              <span className="text-gray-600 font-medium min-w-[80px]">Address:</span>
                              <span className="text-gray-900">{applicantDetails.address}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Signature Section */}
                  <div className="pt-8 border-t border-gray-200">
                    <div className="flex justify-between items-end">
                      {/* Date and Place */}
                      <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">Date:</span>
                          <span className="border-b border-gray-400 px-2 pb-1 min-w-[120px] text-center">
                            {currentDate}
                          </span>
                        </div>
                        {showPlace && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Place:</span>
                            <span className="border-b border-gray-400 px-2 pb-1 min-w-[120px] text-center">
                              {customPlace || userLocation}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Signature */}
                      <div className="text-center space-y-3">
                        <div className="flex flex-col items-center">
                          {signature ? (
                            <div className="border border-gray-300 rounded p-2 bg-white">
                              <img 
                                src={signature} 
                                alt="Digital Signature" 
                                className="h-16 w-auto max-w-[200px]"
                              />
                            </div>
                          ) : (
                            <div className="h-16 w-48 border-b-2 border-gray-400"></div>
                          )}
                        </div>
                        <div className="text-sm space-y-1">
                          <p className="font-medium text-gray-900">
                            {applicantDetails?.name || '[Your Name]'}
                          </p>
                          <p className="text-gray-600">Applicant Signature</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Footer */}
                  <Separator />
                  <div className="text-center">
                    <p className="text-xs text-gray-500 font-light">
                      This application is generated in compliance with the Right to Information Act, 2005
                    </p>
                  </div>
        </div>
      </CardContent>
    </Card>
          </motion.div>
        </div>
      </ScrollArea>
    </div>
  );
} 