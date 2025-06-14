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
    <div className="flex items-center gap-1 p-3 border-b border-gray-200 bg-gray-50/50">
      <div className="flex items-center gap-1">
        <Toggle
          aria-label="Bold"
          pressed={editor?.isActive('bold')}
          onPressedChange={() => editor?.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 hover:data-[state=on]:bg-gray-900 hover:data-[state=off]:bg-gray-900 hover:data-[state=off]:text-gray-50"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Italic"
          pressed={editor?.isActive('italic')}
          onPressedChange={() => editor?.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 hover:data-[state=on]:bg-gray-900 hover:data-[state=off]:bg-gray-900 hover:data-[state=off]:text-gray-50"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Heading 1"
          pressed={editor?.isActive('heading', { level: 1 })}
          onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          className="h-8 w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 hover:data-[state=on]:bg-gray-900 hover:data-[state=off]:bg-gray-900 hover:data-[state=off]:text-gray-50"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle> 
        <Toggle
          aria-label="Heading 2"
          pressed={editor?.isActive('heading', { level: 2 })}
          onPressedChange={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-8 w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 hover:data-[state=on]:bg-gray-900 hover:data-[state=off]:bg-gray-900 hover:data-[state=off]:text-gray-50"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Bullet List"
          pressed={editor?.isActive('bulletList')}
          onPressedChange={() => editor?.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 hover:data-[state=on]:bg-gray-900 hover:data-[state=off]:bg-gray-900 hover:data-[state=off]:text-gray-50"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Numbered List"
          pressed={editor?.isActive('orderedList')}
          onPressedChange={() => editor?.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 hover:data-[state=on]:bg-gray-900 hover:data-[state=off]:bg-gray-900 hover:data-[state=off]:text-gray-50"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          aria-label="Quote"
          pressed={editor?.isActive('blockquote')}
          onPressedChange={() => editor?.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0 data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900"
        >
          <Quote className="h-4 w-4" />
        </Toggle>
      </div>
      <Separator orientation="vertical" className="h-6 mx-2" />
      <div className="text-xs text-gray-500 font-light">
        {wordCount} words
      </div>
    </div>
  );
} 