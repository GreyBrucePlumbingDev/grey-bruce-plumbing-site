import React, { useState, useRef } from 'react';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Dropcursor from '@tiptap/extension-dropcursor';
import { supabase } from '../lib/supabase';

interface TipTapProps {
  initialContent: string;
  onSave?: (content: string) => void;
  isSaving?: boolean;
  saveButtonText?: string;
  loadingSaveText?: string;
  editorHeight?: string;
  bucketName?: string;
  folderPath?: string;
}

const ImageUploadButton = ({ folderPath = 'images'}) => {
  const { editor } = useCurrentEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  if (!editor) {
    return null;
  }

  const uploadImage = async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folderPath}/${fileName}`;
      
      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('assets') 
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('assets') 
        .getPublicUrl(filePath);
      
      // Insert image in editor
      editor.chain().focus().setImage({ src: urlData.publicUrl, alt: file.name }).run();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImage(e.target.files[0]);
    }
  };

  return (
    <>
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/gif, image/webp"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${isUploading ? 'bg-gray-300' : 'bg-gray-100'}`}
      >
        {isUploading ? 'Uploading...' : 'Image'}
      </button>
    </>
  );
};

const MenuBar = ({ folderPath }: { folderPath?: string }) => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4 pb-2 border-b">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-[#152f59] text-white' : 'bg-gray-100'}`}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-[#152f59] text-white' : 'bg-gray-100'}`}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-[#152f59] text-white' : 'bg-gray-100'}`}
      >
        Strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-[#152f59] text-white' : 'bg-gray-100'}`}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-[#152f59] text-white' : 'bg-gray-100'}`}
      >
        H3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 4 }) ? 'bg-[#152f59] text-white' : 'bg-gray-100'}`}
      >
        H4
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-[#152f59] text-white' : 'bg-gray-100'}`}
      >
        Bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-[#152f59] text-white' : 'bg-gray-100'}`}
      >
        Ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-[#152f59] text-white' : 'bg-gray-100'}`}
      >
        Quote
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="px-2 py-1 rounded hover:bg-gray-200 bg-gray-100"
      >
        Divider
      </button>
      <ImageUploadButton folderPath={folderPath} />
      <button
        onClick={() => editor.chain().focus().setColor('#7ac144').run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('textStyle', { color: '#7ac144' }) ? 'bg-[#7ac144] text-white' : 'bg-gray-100'}`}
      >
        Brand Green
      </button>
      <button
        onClick={() => editor.chain().focus().setColor('#152f59').run()}
        className={`px-2 py-1 rounded hover:bg-gray-200 ${editor.isActive('textStyle', { color: '#152f59' }) ? 'bg-[#152f59] text-white' : 'bg-gray-100'}`}
      >
        Brand Blue
      </button>
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        className="px-2 py-1 rounded hover:bg-gray-200 bg-gray-100"
      >
        Clear marks
      </button>
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="px-2 py-1 rounded hover:bg-gray-200 bg-gray-100"
      >
        Undo
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="px-2 py-1 rounded hover:bg-gray-200 bg-gray-100"
      >
        Redo
      </button>
    </div>
  );
};

const SaveButton = ({ onSave, isSaving, saveButtonText, loadingSaveText }: { 
  onSave?: (content: string) => void, 
  isSaving?: boolean,
  saveButtonText?: string,
  loadingSaveText?: string
}) => {
  const { editor } = useCurrentEditor();
  
  if (!editor || !onSave) {
    return null;
  }
  
  return (
    <button
      onClick={() => onSave(editor.getHTML())}
      disabled={isSaving}
      className="btn bg-[#7ac144] hover:bg-[#6aad39] text-white"
    >
      {isSaving ? (
        <>
          <span className="loading loading-spinner loading-sm mr-2"></span>
          {loadingSaveText || 'Saving...'}
        </>
      ) : (
        saveButtonText || 'Save Changes'
      )}
    </button>
  );
};

const TipTap: React.FC<TipTapProps> = ({
  initialContent = '',
  onSave,
  isSaving = false,
  saveButtonText,
  loadingSaveText,
  editorHeight = 'min-h-[300px]',
  folderPath = 'images'
}) => {
  // Set up TipTap extensions
  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    Image.configure({
      inline: false,
      allowBase64: false,
      HTMLAttributes: {
        class: 'rounded-lg max-w-full h-auto my-4',
      },
    }),
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false,
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false,
      },
    }),
    Dropcursor,
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <EditorProvider 
        slotBefore={<MenuBar folderPath={folderPath} />} 
        extensions={extensions} 
        content={initialContent}
        editorContainerProps={{ className: `tiptap-editor prose max-w-none ${editorHeight} p-4` }}
      >
        {onSave && (
          <div className="border-t border-gray-200 p-4 flex justify-end">
            <SaveButton 
              onSave={onSave} 
              isSaving={isSaving} 
              saveButtonText={saveButtonText}
              loadingSaveText={loadingSaveText}
            />
          </div>
        )}
      </EditorProvider>
      
      {/* TipTap editor styling */}
      <style>{`
        /* TipTap editor styling */
        .tiptap-editor {
          /* Make sure the editor has proper styling */
          font-family: inherit;
        }
        
        /* First child styling */
        .tiptap-editor > *:first-child {
          margin-top: 0;
        }
        
        /* List styling */
        .tiptap-editor ul {
          list-style-type: disc;
          padding: 0 1rem;
          margin: 1.25rem 1rem 1.25rem 0.4rem;
        }
        
        .tiptap-editor ol {
          list-style-type: decimal;
          padding: 0 1rem;
          margin: 1.25rem 1rem 1.25rem 0.4rem;
        }
        
        .tiptap-editor li p {
          margin-top: 0.25em;
          margin-bottom: 0.25em;
        }
        
        /* Heading styling */
        .tiptap-editor h1, 
        .tiptap-editor h2, 
        .tiptap-editor h3, 
        .tiptap-editor h4, 
        .tiptap-editor h5, 
        .tiptap-editor h6 {
          line-height: 1.1;
          margin-top: 2.5rem;
          text-wrap: pretty;
        }
        
        .tiptap-editor h1, 
        .tiptap-editor h2 {
          margin-top: 3.5rem;
          margin-bottom: 1.5rem;
        }
        
        .tiptap-editor h1 { 
          font-size: 1.4rem; 
        }
        
        .tiptap-editor h2 { 
          font-size: 1.2rem; 
        }
        
        .tiptap-editor h3 { 
          font-size: 1.1rem; 
        }
        
        .tiptap-editor h4, 
        .tiptap-editor h5, 
        .tiptap-editor h6 { 
          font-size: 1rem; 
        }
        
        /* Code styling */
        .tiptap-editor code {
          background-color: #f0e6ff;
          border-radius: 0.4rem;
          color: #000;
          font-size: 0.85rem;
          padding: 0.25em 0.3em;
        }
        
        .tiptap-editor pre {
          background: #000;
          border-radius: 0.5rem;
          color: #fff;
          font-family: 'JetBrainsMono', monospace;
          margin: 1.5rem 0;
          padding: 0.75rem 1rem;
        }
        
        .tiptap-editor pre code {
          background: none;
          color: inherit;
          font-size: 0.8rem;
          padding: 0;
        }
        
        /* Blockquote styling */
        .tiptap-editor blockquote {
          border-left: 3px solid #cbd5e1;
          margin: 1.5rem 0;
          padding-left: 1rem;
        }
        
        /* Horizontal rule styling */
        .tiptap-editor hr {
          border: none;
          border-top: 1px solid #e2e8f0;
          margin: 2rem 0;
        }
        
        /* Bullet list styling with proper indentation */
        .tiptap-editor ul li {
          position: relative;
          margin-left: 1rem;
        }
        
        /* Ordered list styling with proper indentation */
        .tiptap-editor ol li {
          position: relative;
          margin-left: 1rem;
        }
        
        /* Nested list styling */
        .tiptap-editor ul ul,
        .tiptap-editor ol ol,
        .tiptap-editor ul ol,
        .tiptap-editor ol ul {
          margin-top: 0.5rem;
          margin-bottom: 0.5rem;
        }
        
        /* Image styling */
        .tiptap-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
      `}</style>
    </div>
  );
};

export default TipTap;