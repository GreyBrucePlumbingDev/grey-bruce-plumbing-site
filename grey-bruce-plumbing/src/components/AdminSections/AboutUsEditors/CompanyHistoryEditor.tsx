import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { CompanyHistory } from '../AboutUsEditor';
import { Loader2, Upload } from 'lucide-react';
import TipTap from '../../TipTap';

interface CompanyHistoryEditorProps {
  showNotification: (type: 'success' | 'error', message: string) => void;
}

const CompanyHistoryEditor: React.FC<CompanyHistoryEditorProps> = ({ 
  showNotification 
}) => {
    const [companyHistory, setCompanyHistory] = useState<CompanyHistory | null>(null); 
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [richContent, setRichContent] = useState<string>("");

    useEffect(() => {
        fetchCompanyHistory();
    }, []);

    const fetchCompanyHistory = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('company_history')
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
                
                setCompanyHistory({
                    id: data.id,
                    title: data.title,
                    content: htmlContent,
                    imageUrl: data.image_url,
                    imageAlt: data.image_alt
                });
            }
        } catch (error) {
            console.error('Error fetching company history:', error);
            showNotification('error', 'Failed to load company history');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        if (!file) return;
        
        setUploading(true);
        
        try {
            // Create a unique file name
            const fileExt = file.name.split('.').pop();
            const fileName = `company_history-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
            const filePath = `about_us/${fileName}`;
            
            // Upload the file to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file);
            
            if (uploadError) throw uploadError;
            
            // Get the public URL
            const { data: publicUrlData } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath);
            
            if (publicUrlData && companyHistory) {
                // Update the company history state with the new image URL
                setCompanyHistory({
                    ...companyHistory,
                    imageUrl: publicUrlData.publicUrl
                });
                showNotification('success', 'Image uploaded successfully');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            showNotification('error', 'Error uploading image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleSave = async () => {
        if (!companyHistory) return;
        
        try {
            setSaving(true);
            
            const formattedData = {
                title: companyHistory.title,
                content: richContent,
                image_url: companyHistory.imageUrl,
                image_alt: companyHistory.imageAlt,
                updated_at: new Date().toISOString()
            };
            
            let result;
            if (companyHistory.id) {
                result = await supabase
                .from('company_history')
                .update(formattedData)
                .eq('id', companyHistory.id);
            } else {
                result = await supabase
                .from('company_history')
                .insert([formattedData]);
            }
            
            if (result.error) {
                throw result.error;
            }
            
            showNotification('success', 'Company history saved successfully');
            
            // Refresh data if it was a new record to get the ID
            if (!companyHistory.id) {
                fetchCompanyHistory();
            }
        } catch (error) {
            console.error('Error saving company history:', error);
            showNotification('error', 'Failed to save company history');
        } finally {
            setSaving(false);
        }
    };

    const handleContentSave = (htmlContent: string) => {
        setRichContent(htmlContent);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
                <span className="ml-2">Loading...</span>
            </div>
        );
    }

    if (!companyHistory) {
        return (
        <div className="text-center p-8">
            <p className="mb-4">No company history found. Create one now?</p>
            <button 
            className="btn btn-primary"
            onClick={() => {
                setCompanyHistory({
                    title: "Company History",
                    content: "<p></p>", // Empty paragraph for TipTap
                    imageUrl: "",
                    imageAlt: "Company History"
                });
                setRichContent("<p></p>");
            }}
            >
            Create Company History Section
            </button>
        </div>
        );
    }

    return (
        <div className="space-y-6">
        <h2 className="text-xl font-semibold">Company History</h2>
        
        <div className="form-control">
            <label className="label">
            <span className="label-text">Section Title</span>
            </label>
            <input
            type="text"
            className="input input-bordered w-full"
            value={companyHistory.title}
            onChange={(e) => setCompanyHistory({...companyHistory, title: e.target.value})}
            />
        </div>
        
        <div className="form-control">
            <label className="label">
            <span className="label-text">Content</span>
            </label>
            <TipTap
                initialContent={richContent}
                onSave={handleContentSave}
                editorHeight="min-h-[300px]"
                saveButtonText="Apply Changes"
            />
        </div>
        
        <div className="form-control">
            <label className="label">
                <span className="label-text">Image</span>
            </label>
            <div className="flex flex-col gap-4">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={companyHistory.imageUrl}
                        onChange={(e) => setCompanyHistory({...companyHistory, imageUrl: e.target.value})}
                        placeholder="Image URL"
                        readOnly
                    />
                    <label className={`btn btn-outline ${uploading ? 'loading' : ''}`}>
                        {!uploading && <Upload className="h-5 w-5 mr-1" />}
                        {uploading ? 'Uploading...' : 'Upload'}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={uploading}
                        />
                    </label>
                </div>
                
                <div className="form-control">
                    <input
                        type="text"
                        className="input input-bordered w-full"
                        value={companyHistory.imageAlt}
                        onChange={(e) => setCompanyHistory({...companyHistory, imageAlt: e.target.value})}
                        placeholder="Image alt text"
                    />
                </div>
                
                {companyHistory.imageUrl && (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border">
                        <img
                            src={companyHistory.imageUrl}
                            alt={companyHistory.imageAlt}
                            className="object-cover w-full h-full"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
        
        <div className="mt-6">
            <button 
            className="btn btn-primary w-full"
            onClick={handleSave}
            disabled={saving}
            >
            {saving ? (
                <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Saving...
                </>
            ) : 'Save Company History'}
            </button>
        </div>
        </div>
    );
};

export default CompanyHistoryEditor;