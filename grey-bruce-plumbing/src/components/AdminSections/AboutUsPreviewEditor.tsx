// src/components/admin/AboutUsPreviewEditor.tsx
import React, { useState, useEffect } from 'react';
import { useAboutUs } from '../../hooks/useAboutUs';
import { supabase } from '../../lib/supabase';
import TipTap from '../../components/TipTap';

// Define the interface for the AboutUs content
interface AboutUsContent {
  id?: string;
  content: string;
  image_url: string;
  years_in_business: number;
  created_at?: string;
  updated_at?: string;
}

const AboutUsPreviewEditor: React.FC = () => {
  const { aboutUsContent, loading, error, refreshAboutUs } = useAboutUs();
  const [yearsInBusiness, setYearsInBusiness] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [initialContent, setInitialContent] = useState('');

  // Update form when data is loaded
  useEffect(() => {
    if (aboutUsContent) {
      setInitialContent(aboutUsContent.content || '');
      setYearsInBusiness(aboutUsContent.years_in_business || 0);
      setImagePreview(aboutUsContent.image_url || null);
    }
  }, [aboutUsContent]);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Clean up preview URL when component unmounts
      return () => URL.revokeObjectURL(previewUrl);
    }
  };

  // We need to access the editor content from the save handler
  const handleSave = async (editorContent: string) => {
    setIsSaving(true);
    setSaveMessage(null);
    
    try {
      let imageUrl = aboutUsContent?.image_url || '';
      
      // Upload image if a new one was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `about-us-${Date.now()}.${fileExt}`;
        const filePath = `images/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('assets')
          .upload(filePath, imageFile, {
            upsert: true,
          });
          
        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`);
        }
        
        // Get the public URL for the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrlData.publicUrl;
      }
      
      const updatedContent: AboutUsContent = {
        content: editorContent,
        image_url: imageUrl,
        years_in_business: yearsInBusiness,
        updated_at: new Date().toISOString(),
      };
      
      // Update or insert data in Supabase
      if (aboutUsContent?.id) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('about_us')
          .update(updatedContent)
          .eq('id', aboutUsContent.id);
          
        if (updateError) {
          throw new Error(`Error updating content: ${updateError.message}`);
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('about_us')
          .insert({
            ...updatedContent,
            created_at: new Date().toISOString(),
          });
          
        if (insertError) {
          throw new Error(`Error inserting content: ${insertError.message}`);
        }
      }
      
      setSaveMessage({ type: 'success', text: 'Content saved successfully!' });
      refreshAboutUs(); // Refresh the data
    } catch (err) {
      console.error('Error saving content:', err);
      setSaveMessage({ 
        type: 'error', 
        text: err instanceof Error ? err.message : 'An unknown error occurred' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Loading editor...</p>
      </div>
    );
  }

  if (error && !aboutUsContent) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error loading content: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#152f59]">Edit About Us Content</h2>
      
      <div className="mb-6">
        <label htmlFor="yearsInBusiness" className="block text-sm font-medium text-gray-700 mb-1">
          Years in Business
        </label>
        <input
          type="text"
          id="yearsInBusiness"
          className="input input-bordered w-full max-w-xs"
          value={yearsInBusiness}
          onChange={(e) => setYearsInBusiness(Number(e.target.value))}
          placeholder="e.g. 25"
        />
      </div>
      
      {/* Image upload field */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Team Photo
        </label>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Recommended size: 800x600 pixels
            </p>
          </div>
          
          {/* Image preview */}
          <div className="flex-1">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto max-h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <p className="text-gray-400">No image selected</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* TipTap editor using our new component */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          About Us Content
        </label>
        <TipTap
          key={initialContent}
          initialContent={initialContent}
          onSave={handleSave}
          isSaving={isSaving}
          editorHeight="min-h-[300px]"
        />
      </div>
      
      {/* Save message */}
      {saveMessage && (
        <div className={`mt-4 p-4 rounded-lg ${saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {saveMessage.text}
        </div>
      )}
    </div>
  );
};

export default AboutUsPreviewEditor;