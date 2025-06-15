import { Type } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { EditorToolbar } from "./editor-toolbar";
import { Editor, EditorContent } from '@tiptap/react';

interface ManualModeProps {
  editor: Editor | null;
  wordCount: number;
}

export function ManualMode({ editor, wordCount }: ManualModeProps) {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="text-center py-6 sm:py-8 mb-6 sm:mb-8">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <Type className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
        </div>
        <h3 className="text-xl sm:text-2xl font-light text-gray-900 mb-2 sm:mb-3">Manual Composition</h3>
        <p className="text-sm sm:text-base text-gray-500 font-light max-w-md mx-auto px-4">
          Write your RTI application from scratch with our enhanced text editor
        </p>
      </div>

      {/* Clean Editor */}
      <Card className="border border-gray-200">
        <CardContent className="p-0">
          {/* Enhanced Editor Toolbar */}
          {editor && <EditorToolbar editor={editor} />}
          <div className="border-0 rounded-b-xl min-h-[400px] sm:min-h-[500px] focus-within:ring-1 focus-within:ring-gray-400 transition-all">
            <EditorContent editor={editor} />
          </div>
        </CardContent>
      </Card>
      <CardFooter className="px-0">
        <div className="mt-2 text-xs text-gray-500">
          Tip: Use the Legal Assistant in the sidebar for case laws and RTI references
        </div>
      </CardFooter>
    </div>
  );
} 