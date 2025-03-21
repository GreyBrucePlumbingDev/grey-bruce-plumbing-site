import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { CareerSection } from '../AboutUsEditor';
import { Upload, Loader2 } from 'lucide-react';
import TipTap from '../../TipTap';

interface CareerSectionEditorProps {
  showNotification: (type: 'success' | 'error', message: string) => void;
}

const CareerSectionEditor: React.FC<CareerSectionEditorProps> = ({ showNotification }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [careerSection, setCareerSection] = useState<CareerSection | null>(null);
  const [richContent, setRichContent] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch career section data
  useEffect(() => {
    fetchCareerSection();
  }, []);

  const fetchCareerSection = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('career_section')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw error;
      }

      if (data) {
        // Convert array content to HTML string for TipTap
        let htmlContent = "";
        
        if (typeof data.content === 'string') {
          try {
            // If content is stored as JSON string, parse it
            const contentArray = JSON.parse(data.content);
            htmlContent = contentArray.map((para: string) => `<p>${para}</p>`).join('');
          } catch (e) {
            // If it's already HTML content
            htmlContent = data.content;
          }
        } else if (Array.isArray(data.content)) {
          // If content is already an array
          htmlContent = data.content.map((para: string) => `<p>${para}</p>`).join('');
        }
        
        setRichContent(htmlContent);
        
        setCareerSection({
          id: data.id,
          title: data.title,
          content: [], // We'll use richContent instead
          buttonText: data.button_text,
          buttonUrl: data.button_url,
          imageUrl: data.image_url,
          imageAlt: data.image_alt
        });
        
        setImagePreview(data.image_url);
      } else {
        // Default values if no data exists
        const defaultHtmlContent = "<p>Your join the team content here.</p><p>Additional paragraphs here.</p>";
        setRichContent(defaultHtmlContent);
        
        setCareerSection({
          title: "Join the Team",
          content: [],
          buttonText: "Apply Now",
          buttonUrl: "/careers/apply",
          imageUrl: "/placeholder-careers.jpg",
          imageAlt: "Join Our Team"
        });
        
        setImagePreview("/placeholder-careers.jpg");
      }
    } catch (error) {
      console.error('Error fetching career section:', error);
      showNotification('error', 'Failed to load career section data');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    if (!file || !careerSection) return;
    
    setIsUploading(true);
    
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `career_section-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `about-us/${fileName}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);
      
      if (publicUrlData) {
        // Update the career section state with the new image URL
        const imageUrl = publicUrlData.publicUrl;
        setCareerSection({
          ...careerSection,
          imageUrl: imageUrl
        });
        setImagePreview(imageUrl);
        showNotification('success', 'Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('error', 'Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle image file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Handle content save from TipTap
  const handleContentSave = (htmlContent: string) => {
    setRichContent(htmlContent);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!careerSection) return;
    
    const { name, value } = e.target;
    setCareerSection({
      ...careerSection,
      [name]: value
    });
  };

  // Save career section data
  const handleSave = async () => {
    if (!careerSection) return;
    
    try {
      setIsSaving(true);
      
      const formattedData = {
        title: careerSection.title,
        content: richContent,
        button_text: careerSection.buttonText,
        button_url: careerSection.buttonUrl,
        image_url: careerSection.imageUrl,
        image_alt: careerSection.imageAlt,
        updated_at: new Date().toISOString()
      };
      
      let result;
      if (careerSection.id) {
        result = await supabase
          .from('career_section')
          .update(formattedData)
          .eq('id', careerSection.id);
      } else {
        result = await supabase
          .from('career_section')
          .insert([formattedData]);
      }
      
      if (result.error) {
        throw result.error;
      }
      
      showNotification('success', 'Career section saved successfully');
      
      // Refresh data if it was a new record to get the ID
      if (!careerSection.id) {
        fetchCareerSection();
      }
    } catch (error) {
      console.error('Error saving career section:', error);
      showNotification('error', 'Failed to save career section');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2">Loading career section data...</span>
      </div>
    );
  }

  if (!careerSection) {
    return (
      <div className="p-4 bg-white rounded-lg">
        <p className="text-red-500">Error: Failed to load career section data</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Career Section Editor</h2>
      
      <div className="space-y-6">
        {/* Title */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Section Title</span>
          </label>
          <input 
            type="text" 
            className="input input-bordered w-full"
            name="title"
            value={careerSection.title}
            onChange={handleInputChange}
          />
        </div>
        
        {/* Rich Text Content */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Content</span>
          </label>
          <TipTap 
            initialContent={richContent} 
            onSave={handleContentSave}
            editorHeight="min-h-[200px]"
          />
        </div>
        
        {/* Button Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Button Text</span>
            </label>
            <input 
              type="text" 
              className="input input-bordered w-full"
              name="buttonText"
              value={careerSection.buttonText}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Button URL</span>
            </label>
            <input 
              type="text" 
              className="input input-bordered w-full"
              name="buttonUrl"
              value={careerSection.buttonUrl}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        {/* Image Upload */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-medium">Section Image</span>
          </label>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Image URL"
                  name="imageUrl"
                  value={careerSection.imageUrl}
                  onChange={handleInputChange}
                  readOnly
                />
                <label className="btn btn-outline">
                  <Upload size={18} className={isUploading ? 'hidden' : 'mr-1'} />
                  {isUploading ? <Loader2 className="animate-spin mr-1" size={18} /> : null}
                  {isUploading ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
              
              <div className="form-control w-full">
                <input 
                  type="text" 
                  className="input input-bordered w-full"
                  placeholder="Image alt text"
                  name="imageAlt"
                  value={careerSection.imageAlt}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="border rounded-lg p-2 max-h-48 overflow-hidden">
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover object-center" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                  No image preview
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button 
            onClick={handleSave} 
            className="btn btn-primary" 
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="animate-spin mr-2" size={18} />
                Saving...
              </>
            ) : (
              'Save Career Section'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CareerSectionEditor;