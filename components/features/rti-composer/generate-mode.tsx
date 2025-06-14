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
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      <div className="text-center py-6 sm:py-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </div>
        <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-2 sm:mb-3">AI-Powered Generation</h3>
        <p className="text-sm sm:text-base text-gray-500 font-light max-w-md mx-auto px-4">
          Describe what information you need, and we'll create a professional RTI application
        </p>
      </div>

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
          onClick={onGenerate}
          disabled={isGenerating || !query.trim() || !departmentId}
          className="w-full h-12 sm:h-14 text-sm sm:text-base bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-light"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent mr-2 sm:mr-3" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
              Generate RTI Application
            </>
          )}
        </Button>
        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-3 sm:mt-4">
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-white/60 rounded-lg border border-gray-100">
              <Target className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
              <div className="text-xs">
                <div className="font-medium text-gray-700">Professional Format</div>
                <div className="text-gray-500">Follows RTI Act guidelines</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 sm:p-3 bg-white/60 rounded-lg border border-gray-100">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
              <div className="text-xs">
                <div className="font-medium text-gray-700">Quick Generation</div>
                <div className="text-gray-500">Ready in seconds</div>
              </div>
            </div>
          </div>
      </div>

      {/* Generated Content Preview */}
      {generatedContent && (
        <div className="mt-6 sm:mt-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4">
            <Label className="text-sm font-medium text-gray-900">Generated RTI Application</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={onPreview}
              className="rounded-lg hover:bg-gray-900 hover:text-gray-50 self-start sm:self-auto"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
          <Card className="border border-gray-200">
            <CardContent className="p-0">
              <EditorToolbar editor={editor} wordCount={wordCount} />
              <div className="border-0 rounded-b-xl min-h-[300px] sm:min-h-[400px] focus-within:ring-1 focus-within:ring-gray-400 transition-all">
                <EditorContent editor={editor} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 