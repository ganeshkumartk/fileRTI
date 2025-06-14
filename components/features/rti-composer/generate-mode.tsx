import { Wand2, Sparkles, Eye, Target, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
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

interface GenerateModeProps {
  query: string;
  departmentId?: string;
  departments: Department[];
  departmentsLoading: boolean;
  departmentsError: any;
  isGenerating: boolean;
  generatedContent: string;
  applicantData: ApplicantData;
  editor: Editor | null;
  wordCount: number;
  onQueryChange: (query: string) => void;
  onDepartmentChange: (departmentId: string) => void;
  onVoiceTranscript: (transcript: string) => void;
  onGenerate: () => void;
  onPreview: () => void;
}

export function GenerateMode({
  query,
  departmentId,
  departments,
  departmentsLoading,
  departmentsError,
  isGenerating,
  generatedContent,
  applicantData,
  editor,
  wordCount,
  onQueryChange,
  onDepartmentChange,
  onVoiceTranscript,
  onGenerate,
  onPreview
}: GenerateModeProps) {
  return (
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
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="pr-14 min-h-[120px] resize-none border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 rounded-xl"
              rows={4}
            />
            <div className="absolute top-4 right-4">
              <VoiceInput onTranscript={onVoiceTranscript} />
            </div>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-900 mb-3 block">
            Government Department
          </Label>
          <Select value={departmentId || ""} onValueChange={onDepartmentChange}>
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
              <div className="h-2 w-2 bg-gray-500 rounded-full" />
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
        </div>

        <Button
          onClick={onGenerate}
          disabled={isGenerating || !query.trim() || !departmentId}
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
              onClick={onPreview}
              className="rounded-lg hover:bg-gray-900 hover:text-gray-50"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
          <Card className="border border-gray-200">
            <CardContent className="p-0">
              <EditorToolbar editor={editor} wordCount={wordCount} />
              <div className="border-0 rounded-b-xl min-h-[400px] focus-within:ring-1 focus-within:ring-gray-400 transition-all">
                <EditorContent editor={editor} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 