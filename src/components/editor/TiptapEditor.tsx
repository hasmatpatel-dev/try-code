'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Link2,
} from 'lucide-react';

interface TiptapEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TiptapEditor({ value, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-400 underline hover:text-purple-300',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl max-w-full my-4 border border-gray-800 shadow-md',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write your story here... (Markdown shortcuts supported)',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter link URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const MenuBarButton = ({ onClick, isActive, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-xl transition hover:bg-[#1F2937] text-gray-400 hover:text-white shrink-0 ${
        isActive ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'border border-transparent'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-2xl border border-[#161C2C] bg-gray-950 overflow-hidden shadow-xl">
      {/* Styles Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        .ProseMirror {
          outline: none !important;
          min-height: 380px;
          color: #e5e7eb;
          font-size: 0.95rem;
          line-height: 1.625;
        }
        .ProseMirror p {
          margin-bottom: 0.875rem;
        }
        .ProseMirror h1 {
          font-size: 1.875rem;
          font-weight: 800;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          color: #ffffff;
        }
        .ProseMirror h2 {
          font-size: 1.375rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }
        .ProseMirror h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: #ffffff;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.875rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.875rem;
        }
        .ProseMirror li {
          margin-bottom: 0.25rem;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #8b5cf6;
          background-color: rgba(139, 92, 246, 0.05);
          padding: 0.75rem 1rem;
          border-radius: 0 8px 8px 0;
          color: #9ca3af;
          font-style: italic;
          margin-bottom: 0.875rem;
        }
        .ProseMirror pre {
          background-color: #090d1a;
          border: 1px solid #161c2c;
          padding: 0.75rem 1rem;
          border-radius: 12px;
          color: #a78bfa;
          font-family: monospace;
          font-size: 0.85rem;
          margin-bottom: 0.875rem;
          overflow-x: auto;
        }
        .ProseMirror code {
          background-color: rgba(139, 92, 246, 0.1);
          color: #c084fc;
          padding: 0.125rem 0.25rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.875em;
        }
        .ProseMirror pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
          font-size: inherit;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #4b5563;
          pointer-events: none;
          height: 0;
        }
      ` }} />

      {/* Menu bar */}
      <div className="flex flex-wrap items-center gap-1.5 bg-[#090D1A] p-2 border-b border-[#161C2C]">
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </MenuBarButton>
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </MenuBarButton>
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </MenuBarButton>
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </MenuBarButton>

        <div className="h-4 w-px bg-[#161C2C] mx-1" />

        <MenuBarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </MenuBarButton>
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </MenuBarButton>

        <div className="h-4 w-px bg-[#161C2C] mx-1" />

        <MenuBarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </MenuBarButton>
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </MenuBarButton>
        <MenuBarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </MenuBarButton>

        <div className="h-4 w-px bg-[#161C2C] mx-1" />

        <MenuBarButton onClick={addLink} isActive={editor.isActive('link')} title="Insert Link">
          <Link2 className="h-4 w-4" />
        </MenuBarButton>
        <MenuBarButton onClick={addImage} title="Insert Image">
          <ImageIcon className="h-4 w-4" />
        </MenuBarButton>

        <div className="h-4 w-px bg-[#161C2C] mx-1" />

        <MenuBarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo className="h-4 w-4" />
        </MenuBarButton>
        <MenuBarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo className="h-4 w-4" />
        </MenuBarButton>
      </div>

      {/* Editor Content Area */}
      <div className="p-5 min-h-[380px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
