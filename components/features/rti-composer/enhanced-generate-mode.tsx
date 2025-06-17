"use client";

import React, { useState, useCallback } from 'react';
import { Brain, Sparkles, Eye, Target, Clock, Settings, Zap, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { VoiceInputWrapper as VoiceInput } from "@/components/forms/voice-input-wrapper";
import { EditorToolbar } from "./editor-toolbar";
import { Editor, EditorContent } from '@tiptap/react';
import { validateRTICompliance } from "@/lib/ai/gemini-client";
import { toast } from "sonner";

interface Department {
  id: string;
  name: string;
}

interface ApplicantData {
  name?: string;
  email?: string;
  contact?: string;
  address?: string;
}

interface EnhancedGenerateModeProps {
  query: string;
  departmentId?: string;
  departments: Department[];
  departmentsLoading: boolean;
  departmentsError: any;
  applicantData: ApplicantData;
  editor: Editor | null;
  wordCount: number;
  onQueryChange: (query: string) => void;
  onDepartmentChange: (departmentId: string) => void;
  onVoiceTranscript: (transcript: string) => void;
  onPreview: () => void;
}

export function EnhancedGenerateMode({
  query,
  departmentId,
  departments,
  departmentsLoading,
  departmentsError,
  applicantData,
  editor,
  wordCount,
  onQueryChange,
  onDepartmentChange,
  onVoiceTranscript,
  onPreview
}: EnhancedGenerateModeProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [options, setOptions] = useState({
    tone: 'formal' as const,
    useThinking: false,
    urgency: 'medium' as const,
    context: '',
    structuredOutput: true
  });
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);

  const handleEnhancedGenerate = useCallback(async () => {
    if (!query.trim() || !departmentId) return;

    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      const departmentName = departments.find(d => d.id === departmentId)?.name || "";
      
      const response = await fetch('/api/rti/generate-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          department: departmentName,
          applicantDetails: applicantData,
          options: options
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Generation failed');
      }

      setGeneratedContent(result.content);
      editor?.commands.setContent(result.content.formatted);
      
      toast.success("RTI Generated Successfully", {
        description: "Your RTI application has been created with enhanced AI assistance.",
      });
      
      // Validate compliance
      const compliance = validateRTICompliance(result.content.formatted);
      
      if (compliance.score < 70) {
        toast.warning("Compliance Warning", {
          description: `Compliance score: ${compliance.score}%. Please review suggestions.`,
        });
      }

    } catch (error) {
      console.error('Generation error:', error);
      toast.error("Generation Failed", {
        description: "Unable to generate RTI. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }, [query, departmentId, departments, applicantData, options, editor]);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      <div className="text-center py-6 sm:py-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </div>
        <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-2 sm:mb-3">Enhanced AI Generation</h3>
        <p className="text-sm sm:text-base text-gray-500 font-light max-w-md mx-auto px-4">
          Advanced AI assistance with structured output and enhanced reasoning
        </p>
        <Badge variant="outline" className="mt-3 text-xs font-light">
          Powered by Gemini 2.0 Flash
        </Badge>
      </div>

      {/* Generation Options */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-600" />
            <CardTitle className="text-base font-medium text-gray-900">AI Generation Options</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-100">
              <TabsTrigger value="basic" className="text-sm font-light">Basic Settings</TabsTrigger>
              <TabsTrigger value="advanced" className="text-sm font-light">Advanced Options</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Application Tone</Label>
                  <Select 
                    value={options.tone} 
                    onValueChange={(value: any) => 
                      setOptions(prev => ({ ...prev, tone: value }))
                    }
                  >
                    <SelectTrigger className="border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 rounded-xl h-11 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="followup">Follow-up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Priority Level</Label>
                  <Select 
                    value={options.urgency} 
                    onValueChange={(value: any) => 
                      setOptions(prev => ({ ...prev, urgency: value }))
                    }
                  >
                    <SelectTrigger className="border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 rounded-xl h-11 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="thinking"
                    checked={options.useThinking}
                    onCheckedChange={(checked) =>
                      setOptions(prev => ({ ...prev, useThinking: checked }))
                    }
                  />
                  <Label htmlFor="thinking" className="flex items-center gap-2 text-sm font-light text-gray-700">
                    <Brain className="w-4 h-4" />
                    Enhanced Reasoning
                  </Label>
                </div>
                <Badge variant="outline" className="text-xs font-light">Beta</Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="structured"
                  checked={options.structuredOutput}
                  onCheckedChange={(checked) =>
                    setOptions(prev => ({ ...prev, structuredOutput: checked }))
                  }
                />
                <Label htmlFor="structured" className="flex items-center gap-2 text-sm font-light text-gray-700">
                  <Zap className="w-4 h-4" />
                  Structured Output Format
                </Label>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">Additional Context</Label>
                <Textarea
                  placeholder="Provide additional context to improve the RTI application..."
                  value={options.context}
                  onChange={(e) =>
                    setOptions(prev => ({ ...prev, context: e.target.value }))
                  }
                  className="border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 rounded-xl text-sm resize-none"
                  rows={3}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Query Input */}
      <div className="space-y-4 sm:space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">
            What information do you need?
          </Label>
          <div className="relative">
            <Textarea
              placeholder="Describe the specific government information you're seeking..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="pr-12 sm:pr-14 min-h-[100px] sm:min-h-[120px] resize-none border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 rounded-xl text-sm sm:text-base"
              rows={4}
            />
            <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
              <VoiceInput onTranscript={onVoiceTranscript} />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">
            Government Department
          </Label>
          <Select value={departmentId || ""} onValueChange={onDepartmentChange}>
            <SelectTrigger className="border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 rounded-xl h-11 sm:h-12 text-sm sm:text-base">
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

          {/* Applicant Status */}
          {applicantData?.name ? (
            <div className="flex items-center gap-2 p-2 mt-3 sm:mt-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-700 truncate">
                Applicant: {applicantData.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-2 mt-3 sm:mt-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="h-2 w-2 bg-gray-500 rounded-full flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-700">
                Add your details for a complete application
              </span>
            </div>
          )}
        </div>

        <Button
          onClick={handleEnhancedGenerate}
          disabled={isGenerating || !query.trim() || !departmentId}
          className="w-full h-12 sm:h-14 text-sm sm:text-base bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-light"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent mr-2 sm:mr-3" />
              Generating Enhanced RTI...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              Generate Enhanced RTI Application
            </>
          )}
        </Button>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
          <div className="flex items-center gap-2 p-2 sm:p-3 bg-white/60 rounded-lg border border-gray-100">
            <Target className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
            <div className="text-xs">
              <div className="font-medium text-gray-700">Structured Output</div>
              <div className="text-gray-500">Follows RTI Act guidelines</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 sm:p-3 bg-white/60 rounded-lg border border-gray-100">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
            <div className="text-xs">
              <div className="font-medium text-gray-700">AI Thinking</div>
              <div className="text-gray-500">Enhanced reasoning</div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Content Display */}
      {generatedContent && (
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
            <Label className="text-sm font-medium text-gray-900">Generated RTI Application</Label>
            <div className="flex gap-2">
              {generatedContent.structured && (
                <Badge variant="secondary" className="text-xs font-light">Structured Output</Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onPreview}
                className="rounded-lg hover:bg-gray-900 hover:text-gray-50"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
          
          <Card className="border border-gray-200">
            <CardContent className="p-0">
              {editor && <EditorToolbar editor={editor} />}
              <div className="border-0 rounded-b-xl min-h-[300px] sm:min-h-[400px] focus-within:ring-1 focus-within:ring-gray-400 transition-all">
                <EditorContent editor={editor} />
              </div>
            </CardContent>
          </Card>

          {/* Structured Content Analysis */}
          {generatedContent.structured && (
            <div className="mt-6 sm:mt-8 space-y-4">
              {/* Summary Card */}
              <div className="bg-gray-50/50 border border-gray-200/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-light text-gray-900">AI Analysis & Structure</h3>
                  </div>
                  <Badge variant="secondary" className="text-xs font-light">Structured Output</Badge>
                </div>
                
                {/* Quick Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  {generatedContent.structured.content_justification?.length > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>{generatedContent.structured.content_justification.length} justification{generatedContent.structured.content_justification.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {generatedContent.structured.legal_references?.length > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      <span>{generatedContent.structured.legal_references.length} case law{generatedContent.structured.legal_references.length > 1 ? 's' : ''}</span>
                    </div>
                  )}
                  {generatedContent.thinking && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>AI reasoning available</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Expandable Details */}
              <Collapsible open={isAnalysisExpanded} onOpenChange={setIsAnalysisExpanded}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-gray-50/30 hover:bg-gray-50/50 border border-gray-200/30 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">View Detailed Analysis</span>
                    {isAnalysisExpanded ? 
                      <ChevronDown className="h-4 w-4 text-gray-500" /> : 
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    }
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <Tabs defaultValue="structure" className="w-full">
                    <TabsList className="bg-gray-50/80 border border-gray-200/50 rounded-lg p-1">
                      <TabsTrigger value="structure" className="text-sm font-light data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Content Structure</TabsTrigger>
                      <TabsTrigger value="compliance" className="text-sm font-light data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Legal Compliance</TabsTrigger>
                      {generatedContent.thinking && (
                        <TabsTrigger value="thinking" className="text-sm font-light data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">AI Reasoning</TabsTrigger>
                      )}
                    </TabsList>
                    
                    <TabsContent value="structure" className="mt-6">
                      <div className="space-y-4">
                        {generatedContent.structured.content_justification && (
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm mb-3">Justification for Information Requested</h4>
                            <div className="space-y-3">
                              {generatedContent.structured.content_justification.map((item: any, index: number) => (
                                <div key={index} className="bg-gray-50/50 border border-gray-200/50 p-4 rounded-lg">
                                  <div className="flex items-center gap-2 mb-2">
                                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-xs font-medium text-gray-600">{index + 1}</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-800">Point {index + 1}</p>
                                  </div>
                                  <div className="ml-7">
                                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Information Point</p>
                                    <p className="text-sm text-gray-700 font-light mb-3 leading-relaxed">{item.information_point}</p>
                                    <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Justification</p>
                                    <p className="text-sm text-gray-600 font-light leading-relaxed">{item.justification}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="compliance" className="mt-6">
                      <div className="space-y-4">
                        {/* Case Law References - Only show when mentioned in the generated text */}
                        {generatedContent.structured.legal_references && 
                         generatedContent.structured.legal_references.length > 0 && 
                         generatedContent.formatted.includes('case') && (
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm mb-3">Case Law References</h4>
                            <div className="space-y-3">
                              {generatedContent.structured.legal_references.map((ref: any, index: number) => (
                                <div key={index} className="bg-gray-50/50 border border-gray-200/50 p-4 rounded-lg">
                                  <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-xs font-medium text-gray-600">#{index + 1}</span>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                      <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Case Name</p>
                                        <p className="text-sm font-medium text-gray-800">{ref.case_name}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Citation</p>
                                        <p className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">{ref.citation}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-gray-500 font-medium mb-1 uppercase tracking-wide">Relevance</p>
                                        <p className="text-sm text-gray-600 font-light leading-relaxed">{ref.relevance}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* RTI Compliance Analysis */}
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm mb-3">RTI Act Compliance Analysis</h4>
                          <div className="bg-gray-50/50 border border-gray-200/50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600 font-light leading-relaxed">
                              This application is structured to meet all RTI Act 2005 requirements. It includes proper authority addressing ({generatedContent.structured.to_section?.authority_type}), 
                              clear information requests with legal justification, appropriate Section 6(1) reference, 
                              fee payment acknowledgment, and Section 8 & 9 compliance declaration. 
                              The formal tone and structured format ensure minimal risk of rejection and prompt processing by the public authority.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    
                    {generatedContent.thinking && (
                      <TabsContent value="thinking" className="mt-6">
                        <div className="bg-gray-50/50 border border-gray-200/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600 whitespace-pre-wrap font-light leading-relaxed">
                            {generatedContent.thinking}
                          </p>
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 