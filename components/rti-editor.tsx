import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { cn } from '@/lib/utils'

interface RTIEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  maxLength?: number
}

export function RTIEditor({ content, onChange, placeholder = 'Start typing your RTI query...', maxLength = 3000 }: RTIEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-lg max-w-none',
          'focus:outline-none',
          'min-h-[300px] p-8',
          'leading-relaxed',
          'text-neutral-700',
          'font-light',
          'tracking-wide'
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const characterCount = editor?.storage.characterCount.characters() || 0
  const wordCount = editor?.storage.characterCount.words() || 0
  const isNearLimit = characterCount > maxLength * 0.9

  return (
    <div className="relative">
      <div className="bg-white overflow-hidden">
        <EditorContent editor={editor} />
      </div>
      <div className="flex justify-between items-center px-8 py-4 border-t border-neutral-100/80 bg-neutral-50/30">
        <span className={cn(
          "text-xs font-light tracking-wide",
          isNearLimit ? "text-amber-600" : "text-neutral-500"
        )}>
          {wordCount} words • {characterCount}/{maxLength} characters
        </span>
        {characterCount > 50 && (
          <span className="text-xs text-neutral-600 font-light">
            Perfect length
          </span>
        )}
      </div>
    </div>
  )
} 