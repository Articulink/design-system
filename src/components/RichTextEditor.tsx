'use client';

import { forwardRef, useCallback, useEffect, useRef, useState, ReactNode } from 'react';

/**
 * Articulink RichTextEditor Component
 *
 * WYSIWYG rich text editor using TipTap.
 *
 * IMPORTANT: This component requires TipTap packages as peer dependencies:
 *   npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link
 *              @tiptap/extension-image @tiptap/extension-placeholder
 *
 * Usage:
 *   <RichTextEditor
 *     content={html}
 *     onChange={setHtml}
 *     placeholder="Start writing..."
 *   />
 */

// We need to dynamically import TipTap to avoid SSR issues and allow graceful degradation
let useEditor: typeof import('@tiptap/react').useEditor | undefined;
let EditorContent: typeof import('@tiptap/react').EditorContent | undefined;
let StarterKit: typeof import('@tiptap/starter-kit').default | undefined;
let Link: typeof import('@tiptap/extension-link').default | undefined;
let Image: typeof import('@tiptap/extension-image').default | undefined;
let Placeholder: typeof import('@tiptap/extension-placeholder').default | undefined;

// Try to import TipTap
try {
  const tiptapReact = require('@tiptap/react');
  useEditor = tiptapReact.useEditor;
  EditorContent = tiptapReact.EditorContent;
  StarterKit = require('@tiptap/starter-kit').default;
  Link = require('@tiptap/extension-link').default;
  Image = require('@tiptap/extension-image').default;
  Placeholder = require('@tiptap/extension-placeholder').default;
} catch {
  // TipTap not installed
}

export interface RichTextEditorProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  onImageUpload?: (file: File) => Promise<string>; // Should return the uploaded image URL
  readOnly?: boolean;
  toolbar?: ('bold' | 'italic' | 'heading' | 'list' | 'quote' | 'link' | 'image' | 'undo')[];
}

const defaultToolbar: RichTextEditorProps['toolbar'] = [
  'bold',
  'italic',
  'heading',
  'list',
  'quote',
  'link',
  'image',
  'undo',
];

export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(
  (
    {
      content,
      onChange,
      placeholder = 'Start writing...',
      minHeight = 300,
      onImageUpload,
      readOnly = false,
      toolbar = defaultToolbar,
      className = '',
      ...props
    },
    ref
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    // Check if TipTap is available
    if (!useEditor || !EditorContent || !StarterKit) {
      return (
        <div
          ref={ref}
          className={`border border-mist rounded-lg p-4 bg-warning-bg ${className}`}
          {...props}
        >
          <p className="text-warning-text text-sm">
            RichTextEditor requires TipTap. Install with:
          </p>
          <code className="block mt-2 text-xs bg-white p-2 rounded">
            npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder
          </code>
        </div>
      );
    }

    return (
      <RichTextEditorInner
        ref={ref}
        content={content}
        onChange={onChange}
        placeholder={placeholder}
        minHeight={minHeight}
        onImageUpload={onImageUpload}
        readOnly={readOnly}
        toolbar={toolbar}
        className={className}
        fileInputRef={fileInputRef}
        isUploadingImage={isUploadingImage}
        setIsUploadingImage={setIsUploadingImage}
        {...props}
      />
    );
  }
);

RichTextEditor.displayName = 'RichTextEditor';

// Inner component that uses TipTap hooks
interface RichTextEditorInnerProps extends RichTextEditorProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isUploadingImage: boolean;
  setIsUploadingImage: (value: boolean) => void;
}

const RichTextEditorInner = forwardRef<HTMLDivElement, RichTextEditorInnerProps>(
  (
    {
      content,
      onChange,
      placeholder,
      minHeight,
      onImageUpload,
      readOnly,
      toolbar,
      className,
      fileInputRef,
      isUploadingImage,
      setIsUploadingImage,
      ...props
    },
    ref
  ) => {
    const editor = useEditor!({
      extensions: [
        StarterKit!.configure({
          heading: { levels: [2, 3, 4] },
        }),
        Link!.configure({
          openOnClick: false,
          HTMLAttributes: { class: 'text-tide underline' },
        }),
        Image!.configure({
          HTMLAttributes: { class: 'max-w-full rounded-lg' },
        }),
        Placeholder!.configure({ placeholder }),
      ],
      content,
      editable: !readOnly,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class: `prose prose-sm max-w-none focus:outline-none px-4 py-3`,
          style: `min-height: ${minHeight}px`,
        },
      },
    });

    // Sync content when prop changes
    useEffect(() => {
      if (editor && content !== editor.getHTML()) {
        editor.commands.setContent(content);
      }
    }, [content, editor]);

    const setLink = useCallback(() => {
      if (!editor) return;
      const previousUrl = editor.getAttributes('link').href;
      const url = window.prompt('URL', previousUrl);

      if (url === null) return;
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }

      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const handleImageUpload = useCallback(
      async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editor || !onImageUpload) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
          return;
        }

        if (file.size > 5 * 1024 * 1024) {
          alert('Image must be less than 5MB');
          return;
        }

        setIsUploadingImage(true);
        try {
          const url = await onImageUpload(file);
          editor.chain().focus().setImage({ src: url }).run();
        } catch {
          alert('Failed to upload image');
        } finally {
          setIsUploadingImage(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      },
      [editor, onImageUpload, setIsUploadingImage, fileInputRef]
    );

    if (!editor) {
      return null;
    }

    return (
      <div ref={ref} className={`border border-mist rounded-lg overflow-hidden ${className}`} {...props}>
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Toolbar */}
        {!readOnly && (
          <div className="flex flex-wrap items-center gap-1 p-2 border-b border-mist bg-breeze">
            {toolbar!.includes('bold') && (
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                title="Bold"
              >
                <BoldIcon />
              </ToolbarButton>
            )}

            {toolbar!.includes('italic') && (
              <ToolbarButton
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                title="Italic"
              >
                <ItalicIcon />
              </ToolbarButton>
            )}

            {toolbar!.includes('heading') && (
              <>
                <Divider />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  isActive={editor.isActive('heading', { level: 2 })}
                  title="Heading 2"
                >
                  H2
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                  isActive={editor.isActive('heading', { level: 3 })}
                  title="Heading 3"
                >
                  H3
                </ToolbarButton>
              </>
            )}

            {toolbar!.includes('list') && (
              <>
                <Divider />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  isActive={editor.isActive('bulletList')}
                  title="Bullet List"
                >
                  <ListIcon />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  isActive={editor.isActive('orderedList')}
                  title="Numbered List"
                >
                  <OrderedListIcon />
                </ToolbarButton>
              </>
            )}

            {toolbar!.includes('quote') && (
              <>
                <Divider />
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBlockquote().run()}
                  isActive={editor.isActive('blockquote')}
                  title="Quote"
                >
                  <QuoteIcon />
                </ToolbarButton>
              </>
            )}

            {toolbar!.includes('link') && (
              <ToolbarButton onClick={setLink} isActive={editor.isActive('link')} title="Link">
                <LinkIcon />
              </ToolbarButton>
            )}

            {toolbar!.includes('image') && onImageUpload && (
              <ToolbarButton
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                title="Image"
              >
                {isUploadingImage ? (
                  <div className="w-4 h-4 border-2 border-lagoon border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ImageIcon />
                )}
              </ToolbarButton>
            )}

            {toolbar!.includes('undo') && (
              <>
                <Divider />
                <ToolbarButton
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  title="Undo"
                >
                  <UndoIcon />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  title="Redo"
                >
                  <RedoIcon />
                </ToolbarButton>
              </>
            )}
          </div>
        )}

        {/* Editor */}
        {EditorContent && <EditorContent editor={editor} />}
      </div>
    );
  }
);

RichTextEditorInner.displayName = 'RichTextEditorInner';

// Toolbar button component
function ToolbarButton({
  onClick,
  isActive,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  title: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        p-2 rounded text-sm font-medium transition-colors
        ${isActive ? 'bg-breeze text-tide' : 'text-lagoon hover:bg-mist hover:text-abyss'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-6 bg-mist mx-1" />;
}

// Icons
function BoldIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
    </svg>
  );
}

function ItalicIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 4h4m-2 0v16m-4 0h8" transform="skewX(-10)" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function OrderedListIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function UndoIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
  );
}

function RedoIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
    </svg>
  );
}

export default RichTextEditor;
