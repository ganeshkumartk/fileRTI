import { Target, Wand2, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { VoiceInputWrapper as VoiceInput } from "@/components/forms/voice-input-wrapper";
import { EditorToolbar } from "./editor-toolbar";
import { Editor, EditorContent } from '@tiptap/react';

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

interface CombinedModeProps {
  query: string;
  departmentId?: string;
  departments: Department[];
  departmentsLoading: boolean;
  departmentsError: any;
  isGenerating: boolean;
  applicantData: ApplicantData;
  editor: Editor | null;
  wordCount: number;
  onQueryChange: (query: string) => void;
  onDepartmentChange: (departmentId: string) => void;
  onVoiceTranscript: (transcript: string) => void;
  onGenerate: () => void;
}

export function CombinedMode({
  query,
  departmentId,
  departments,
  departmentsLoading,
  departmentsError,
  isGenerating,
  applicantData,
  editor,
  wordCount,
  onQueryChange,
  onDepartmentChange,
  onVoiceTranscript,
  onGenerate
}: CombinedModeProps) {
  return (
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
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  className="pr-12 border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 rounded-xl"
                  rows={3}
                />
                <div className="absolute top-3 right-3">
                  <VoiceInput onTranscript={onVoiceTranscript} />
                </div>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-900 mb-2 block">
                Department
              </Label>
              <Select value={departmentId || ""} onValueChange={onDepartmentChange}>
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
            onClick={onGenerate}
            disabled={isGenerating || !query.trim() || !departmentId}
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
        
        {/* Info Cards */}
        <div className="grid grid-cols-1 mx-2 md:grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg border border-gray-100">
            <Target className="h-4 w-4 text-gray-600" />
            <div className="text-xs">
              <div className="font-medium text-gray-700">Professional Format</div>
              <div className="text-gray-500">Follows RTI Act guidelines</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg border border-gray-100">
            <Clock className="h-4 w-4 text-gray-600" />
            <div className="text-xs">
              <div className="font-medium text-gray-700">Quick Generation</div>
              <div className="text-gray-500">Ready in seconds</div>
            </div>
          </div>
        </div>

        {/* Applicant Status */}
        {applicantData ? (
          <div className="flex items-center gap-2 p-2 m-2 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="h-2 w-2 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-700">
              Applicant details: {applicantData.name || "Incomplete"}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="h-2 w-2 bg-gray-500 rounded-full" />
            <span className="text-sm text-gray-700">
              Add your details for a complete application
            </span>
          </div>
        )}
      </Card>

      {/* Manual Editing Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h4 className="font-medium text-gray-900">Step 2: Customize & Edit</h4>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </div>

        {/* Clean Editor */}
        <Card className="border border-gray-200">
          <CardContent className="p-0">
            {/* Enhanced Editor Toolbar */}
            {editor && <EditorToolbar editor={editor} />}
            <div className="border-0 rounded-b-xl min-h-[400px] focus-within:ring-1 focus-within:ring-gray-400 transition-all">
              <EditorContent editor={editor} />
            </div>
          </CardContent>
        </Card>
        <CardFooter>
          <div className="mt-2 text-xs text-gray-500">
            Tip: Use the Legal Assistant in the sidebar for case laws and RTI references
          </div>
        </CardFooter>
      </div>
    </div>
  );
}