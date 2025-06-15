import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Highlighter
} from 'lucide-react';

interface EditorToolbarProps {
  editor: Editor;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 px-3 py-2 border-b border-border sticky top-0 z-20">
      {/* Undo/Redo */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="mx-1 h-8" />
      
      {/* Text Formatting */}
      <Button
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive('underline') ? 'default' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive('strike') ? 'default' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive('highlight') ? 'default' : 'ghost'}
        size="icon"
        onClick={() => (editor.chain() as any).focus().toggleHighlight().run()}
      >
        <Highlighter className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="mx-1 h-8" />
      
      {/* Headings */}
      <select
        className="px-2 py-1 border border-border rounded text-sm"
        value={
          editor.isActive('heading', { level: 1 }) ? 'h1' :
          editor.isActive('heading', { level: 2 }) ? 'h2' :
          editor.isActive('heading', { level: 3 }) ? 'h3' :
          'paragraph'
        }
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'h1') {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
          } else if (value === 'h2') {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          } else if (value === 'h3') {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
          } else {
            editor.chain().focus().setParagraph().run();
          }
        }}
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>
      <Separator orientation="vertical" className="mx-1 h-8" />
      
      {/* Alignment */}
      <Button
        variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
        size="icon"
        onClick={() => (editor.chain() as any).focus().setTextAlign('left').run()}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
        size="icon"
        onClick={() => (editor.chain() as any).focus().setTextAlign('center').run()}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
        size="icon"
        onClick={() => (editor.chain() as any).focus().setTextAlign('right').run()}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
        size="icon"
        onClick={() => (editor.chain() as any).focus().setTextAlign('justify').run()}
      >
        <AlignJustify className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="mx-1 h-8" />
      
      {/* Lists and Quote */}
      <Button
        variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
        size="icon"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" />
      </Button>
    </div>
  );
}; 