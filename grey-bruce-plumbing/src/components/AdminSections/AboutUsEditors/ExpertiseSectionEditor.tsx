import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { ExpertiseSection, Certification } from '../AboutUsEditor';
import TipTap from '../../TipTap';
import { Loader2 } from 'lucide-react';

interface ExpertiseSectionEditorProps {
  showNotification: (type: 'success' | 'error', message: string) => void;
}

const ExpertiseSectionEditor: React.FC<ExpertiseSectionEditorProps> = ({ 
  showNotification 
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [richContent, setRichContent] = useState<string>('');
  const [expertiseSection, setExpertiseSection] = useState<ExpertiseSection>({
    title: '',
    content: '',
    certifications: [],
    imageUrl: '',
    imageAlt: ''
  });
  
  const [newCertification, setNewCertification] = useState<Certification>({
    id: 0,
    name: '',
    icon: ''
  });
  
  const [editingCertId, setEditingCertId] = useState<number | null>(null);

  // Fetch expertise section data
  useEffect(() => {
    fetchExpertiseData();
  }, []);

  const fetchExpertiseData = async () => {
    try {
      setLoading(true);
      
      // Fetch expertise section
      const { data: expertiseData, error: expertiseError } = await supabase
        .from('expertise_section')
        .select('*')
        .single();
        
      if (expertiseError && expertiseError.code !== 'PGRST116') {
        throw expertiseError;
      }
      
      // Fetch certifications
      const { data: certificationsData, error: certError } = await supabase
        .from('certifications')
        .select('*')
        .order('id', { ascending: true });
        
      if (certError) {
        throw certError;
      }
      
      // Set expertise section state
      if (expertiseData) {
        let htmlContent = "";
        
        if (typeof expertiseData.content === 'string') {
          try {
            // If content is stored as JSON string, parse it
            const contentArray = JSON.parse(expertiseData.content);
            htmlContent = contentArray.map((para: string) => `<p>${para}</p>`).join('');
          } catch (e) {
            // If it's already HTML content
            htmlContent = expertiseData.content;
          }
        } else if (Array.isArray(expertiseData.content)) {
          // If content is already an array
          htmlContent = expertiseData.content.map((para: string) => `<p>${para}</p>`).join('');
        }
        
        setRichContent(htmlContent);
        
        setExpertiseSection({
          id: expertiseData.id,
          title: expertiseData.title,
          content: htmlContent,
          certifications: certificationsData || [],
          imageUrl: expertiseData.image_url,
          imageAlt: expertiseData.image_alt
        });
      } else {
        // Initialize with default values if no data exists
        const defaultContent = '<p>Your expertise content here.</p>';
        setRichContent(defaultContent);
        
        setExpertiseSection({
          title: 'Certifications and Expertise',
          content: defaultContent,
          certifications: [],
          imageUrl: '',
          imageAlt: 'Certifications and Expertise'
        });
      }
    } catch (error) {
      console.error('Error fetching expertise data:', error);
      showNotification('error', 'Failed to load expertise section data');
    } finally {
      setLoading(false);
    }
  };

  // Handle expertise section input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExpertiseSection({
      ...expertiseSection,
      [name]: value
    });
  };

  // Handle rich content changes
  const handleContentChange = (htmlContent: string) => {
    setRichContent(htmlContent);
  };

  // Handle expertise image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `expertise-${Date.now()}.${fileExt}`;
      const filePath = `about_us/${fileName}`;
      
      setLoading(true);
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);
        
      setExpertiseSection({
        ...expertiseSection,
        imageUrl: data.publicUrl
      });
      
      showNotification('success', 'Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      showNotification('error', 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  // Save expertise section
  const saveExpertiseSection = async () => {
    try {
      if (!expertiseSection.title) {
        showNotification('error', 'Title is required');
        return;
      }
      
      setSaving(true);
      
      // Check if we're updating or inserting
      if (expertiseSection.id) {
        // Update existing record
        const { error } = await supabase
          .from('expertise_section')
          .update({
            title: expertiseSection.title,
            content: richContent,
            image_url: expertiseSection.imageUrl,
            image_alt: expertiseSection.imageAlt,
            updated_at: new Date().toISOString()
          })
          .eq('id', expertiseSection.id);
          
        if (error) throw error;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('expertise_section')
          .insert({
            title: expertiseSection.title,
            content: richContent,
            image_url: expertiseSection.imageUrl,
            image_alt: expertiseSection.imageAlt
          })
          .select();
          
        if (error) throw error;
        
        if (data && data[0]) {
          setExpertiseSection({
            ...expertiseSection,
            id: data[0].id
          });
        }
      }
      
      showNotification('success', 'Expertise section saved successfully');
    } catch (error) {
      console.error('Error saving expertise section:', error);
      showNotification('error', 'Failed to save expertise section');
    } finally {
      setSaving(false);
    }
  };

  // Handle certification input changes
  const handleCertificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCertification({
      ...newCertification,
      [name]: value
    });
  };

  // Upload certification icon
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `cert-icon-${Date.now()}.${fileExt}`;
      const filePath = `certifications/${fileName}`;
      
      setLoading(true);
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
        
      setNewCertification({
        ...newCertification,
        icon: data.publicUrl
      });
      
      showNotification('success', 'Icon uploaded successfully');
    } catch (error) {
      console.error('Error uploading icon:', error);
      showNotification('error', 'Failed to upload icon');
    } finally {
      setLoading(false);
    }
  };

  // Add new certification
  const addCertification = async () => {
    try {
      if (!newCertification.name) {
        showNotification('error', 'Certification name is required');
        return;
      }
      
      setLoading(true);
      
      const { data, error } = await supabase
        .from('certifications')
        .insert({
          name: newCertification.name,
          icon: newCertification.icon
        })
        .select();
        
      if (error) throw error;
      
      if (data) {
        const updatedCertifications = [...expertiseSection.certifications, data[0]];
        setExpertiseSection({
          ...expertiseSection,
          certifications: updatedCertifications
        });
        
        // Reset form
        setNewCertification({
          id: 0,
          name: '',
          icon: ''
        });
        
        showNotification('success', 'Certification added successfully');
      }
    } catch (error) {
      console.error('Error adding certification:', error);
      showNotification('error', 'Failed to add certification');
    } finally {
      setLoading(false);
    }
  };

  // Start editing certification
  const startEditingCertification = (cert: Certification) => {
    setNewCertification({...cert});
    setEditingCertId(cert.id);
  };

  // Update existing certification
  const updateCertification = async () => {
    try {
      if (!newCertification.name) {
        showNotification('error', 'Certification name is required');
        return;
      }
      
      setLoading(true);
      
      const { error } = await supabase
        .from('certifications')
        .update({
          name: newCertification.name,
          icon: newCertification.icon
        })
        .eq('id', editingCertId);
        
      if (error) throw error;
      
      // Update state
      const updatedCertifications = expertiseSection.certifications.map(cert => 
        cert.id === editingCertId ? newCertification : cert
      );
      
      setExpertiseSection({
        ...expertiseSection,
        certifications: updatedCertifications
      });
      
      // Reset form
      setNewCertification({
        id: 0,
        name: '',
        icon: ''
      });
      setEditingCertId(null);
      
      showNotification('success', 'Certification updated successfully');
    } catch (error) {
      console.error('Error updating certification:', error);
      showNotification('error', 'Failed to update certification');
    } finally {
      setLoading(false);
    }
  };

  // Delete certification
  const deleteCertification = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this certification?')) {
      try {
        setLoading(true);
        
        const { error } = await supabase
          .from('certifications')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        // Update state
        const updatedCertifications = expertiseSection.certifications.filter(cert => cert.id !== id);
        setExpertiseSection({
          ...expertiseSection,
          certifications: updatedCertifications
        });
        
        showNotification('success', 'Certification deleted successfully');
      } catch (error) {
        console.error('Error deleting certification:', error);
        showNotification('error', 'Failed to delete certification');
      } finally {
        setLoading(false);
      }
    }
  };

  // Cancel certification edit
  const cancelCertificationEdit = () => {
    setNewCertification({
      id: 0,
      name: '',
      icon: ''
    });
    setEditingCertId(null);
  };

  if (loading && expertiseSection.title === '') {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Expertise Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Expertise Section</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Title *
            </label>
            <input
              type="text"
              name="title"
              value={expertiseSection.title}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Content
            </label>
            <TipTap
              initialContent={richContent}
              onSave={handleContentChange}
              editorHeight="min-h-[200px]"
              saveButtonText="Apply Changes"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section Image
            </label>
            <div className="flex items-start space-x-4">
              {expertiseSection.imageUrl && (
                <img
                  src={expertiseSection.imageUrl}
                  alt={expertiseSection.imageAlt}
                  className="w-32 h-32 object-cover rounded-md"
                />
              )}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input file-input-bordered w-full max-w-xs"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended size: 800x600px
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image Alt Text
            </label>
            <input
              type="text"
              name="imageAlt"
              value={expertiseSection.imageAlt}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="Descriptive text for the image"
            />
          </div>
          
          <div className="pt-4">
            <button
              onClick={saveExpertiseSection}
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Saving...
                </>
              ) : 'Save Expertise Section'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Certifications Management */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Certifications</h2>
        
        {/* Add/Edit Certification Form */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-3">
            {editingCertId ? 'Edit Certification' : 'Add New Certification'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certification Name *
              </label>
              <input
                type="text"
                name="name"
                value={newCertification.name}
                onChange={handleCertificationChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certification Icon
              </label>
              <div className="flex items-center space-x-3">
                {newCertification.icon && (
                  <img
                    src={newCertification.icon}
                    alt={newCertification.name}
                    className="w-10 h-10 object-contain"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconUpload}
                  className="file-input file-input-bordered w-full max-w-xs"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Recommended format: SVG or PNG with transparent background
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            {editingCertId && (
              <button
                onClick={cancelCertificationEdit}
                className="btn btn-ghost btn-sm"
                disabled={loading}
              >
                Cancel
              </button>
            )}
            <button
              onClick={editingCertId ? updateCertification : addCertification}
              className="btn btn-primary btn-sm"
              disabled={loading}
            >
              {loading ? 'Saving...' : editingCertId ? 'Update Certification' : 'Add Certification'}
            </button>
          </div>
        </div>
        
        {/* Certifications List */}
        <div className="overflow-x-auto">
          {expertiseSection.certifications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No certifications added yet. Use the form above to add certifications.
            </p>
          ) : (
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Icon</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expertiseSection.certifications.map((cert) => (
                  <tr key={cert.id}>
                    <td>
                      {cert.icon ? (
                        <img
                          src={cert.icon}
                          alt={cert.name}
                          className="w-10 h-10 object-contain"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No icon</span>
                        </div>
                      )}
                    </td>
                    <td>{cert.name}</td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditingCertification(cert)}
                          className="btn btn-ghost btn-xs"
                          disabled={loading || editingCertId !== null}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCertification(cert.id)}
                          className="btn btn-ghost btn-xs text-red-500"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertiseSectionEditor;