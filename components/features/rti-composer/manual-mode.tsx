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
          <EditorToolbar editor={editor} wordCount={wordCount} />
          <div className="border-0 rounded-b-xl min-h-[500px] focus-within:ring-1 focus-within:ring-gray-400 transition-all">
            <EditorContent editor={editor} />
          </div>
        </CardContent>
      </Card>
      <CardFooter>
        <div className="mt-2 text-xs text-gray-500">
          Tip: Be specific about dates, document types, or particular information you need
        </div>
      </CardFooter>
    </div>
  );
} 