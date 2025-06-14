import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Separator } from "@/components/ui/separator";

interface EditorToolbarProps {
  editor: Editor | null;
  wordCount: number;
}

export function EditorToolbar({ editor, wordCount }: EditorToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-1 p-2 sm:p-3 border-b border-gray-200 bg-gray-50/50">
      {/* Primary formatting buttons */}
      <div className="flex items-center gap-1 flex-wrap">
        <Toggle
          aria-label="Bold"
          pressed={editor?.isActive('bold')}
          onPressedChange={() => editor?.chain().focus().toggleBold().run()}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 hover:data-[state=on]:bg-gray-900 hover:data-[state=off]:bg-gray-900 hover:data-[state=off]:text-gray-50"
        >
          <Bold className="h-3 w-3 sm:h-4 sm:w-4" />
        </Toggle>
        <Toggle
          aria-label="Italic"
          pressed={editor?.isActive('italic')}
          onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 hover:data-[state=on]:bg-gray-900 hover:data-[state=off]:bg-gray-900 hover:data-[state=off]:text-gray-50"
        >
          <Italic className="h-3 w-3 sm:h-4 sm:w-4" />
        </Toggle>
        
        {/* Separator for mobile */}
        <div className="w-px h-4 bg-gray-300 mx-1 hidden xs:block sm:hidden"></div>
        
        <Toggle
          aria-label="Heading 1"
          pressed={editor?.isActive('heading', { level: 1 })}
          onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 hover:data-[state=on]:bg-gray-900 hover:data-[state=off]:bg-gray-900 hover:data-[state=off]:text-gray-50"
        >
          <Heading1 className="h-3 w-3 sm:h-4 sm:w-4" />
        </Toggle> 
        <Toggle
          aria-label="Heading 2"
          pressed={editor?.isActive('heading', { level: 2 })}
          onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 hover:data-[state=on]:bg-gray-900 hover:data-[state=off]:bg-gray-900 hover:data-[state=off]:text-gray-50"
        >
          <Heading2 className="h-3 w-3 sm:h-4 sm:w-4" />
        </Toggle>
        
        {/* Separator for mobile */}
        <div className="w-px h-4 bg-gray-300 mx-1 hidden xs:block sm:hidden"></div>
        
        <Toggle
          aria-label="Bullet List"
          pressed={editor?.isActive('bulletList')}
          onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 hover:data-[state=on]:bg-gray-900 hover:data-[state=off]:bg-gray-900 hover:data-[state=off]:text-gray-50"
        >
          <List className="h-3 w-3 sm:h-4 sm:w-4" />
        </Toggle>
        <Toggle
          aria-label="Numbered List"
          pressed={editor?.isActive('orderedList')}
          onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 hover:data-[state=on]:bg-gray-900 hover:data-[state=off]:bg-gray-900 hover:data-[state=off]:text-gray-50"
        >
          <ListOrdered className="h-3 w-3 sm:h-4 sm:w-4" />
        </Toggle>
        <Toggle
          aria-label="Quote"
          pressed={editor?.isActive('blockquote')}
          onPressedChange={() => editor?.chain().focus().toggleBlockquote().run()}
          className="h-7 w-7 sm:h-8 sm:w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 hover:data-[state=on]:bg-gray-900 hover:data-[state=off]:bg-gray-900 hover:data-[state=off]:text-gray-50"
        >
          <Quote className="h-3 w-3 sm:h-4 sm:w-4" />
        </Toggle>
      </div>
      
      {/* Desktop separator */}
      <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />
      
      {/* Word count - repositioned for mobile */}
      <div className="text-xs text-gray-500 font-light mt-1 sm:mt-0 ml-auto sm:ml-0">
        {wordCount} words
      </div>
    </div>
  );
} 