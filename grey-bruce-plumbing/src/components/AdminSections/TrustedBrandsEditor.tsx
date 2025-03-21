import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { useTrustedBrands } from '../../hooks/useTrustedBrands';

// Zod schema for form validation
const brandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  imageSrc: z.string().min(1, 'Image is required'),
  altText: z.string().min(1, 'Alt text is required'),
});

const trustedBrandsSchema = z.object({
  brands: z.array(brandSchema),
});

type FormValues = z.infer<typeof trustedBrandsSchema>;

const TrustedBrandsEditor: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const { brands, isLoading: brandsLoading, error, mutate } = useTrustedBrands();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(trustedBrandsSchema),
    defaultValues: {
      brands: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'brands'
  });

  // Initialize form with data from Supabase
  useEffect(() => {
    if (brands && !brandsLoading) {
      reset({ brands });
    }
  }, [brands, brandsLoading, reset]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setSaveMessage('');
    
    try {
      // First, delete all existing brands
      const { error: deleteError } = await supabase
        .from('trusted_brands')
        .delete()
        .neq('id', 0); // This will delete all records
      
      if (deleteError) throw deleteError;
      
      // Then insert all the new/updated brands
      if (data.brands.length > 0) {
        const { error: insertError } = await supabase
          .from('trusted_brands')
          .insert(
            data.brands.map((brand, index) => ({
              name: brand.name,
              image_src: brand.imageSrc,
              alt_text: brand.altText,
              display_order: index,
            }))
          );
        
        if (insertError) throw insertError;
      }
      
      setSaveMessage('Trusted brands saved successfully!');
      mutate(); // Refresh the data
    } catch (error) {
      console.error('Error saving trusted brands:', error);
      setSaveMessage('Error saving trusted brands. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!file) return;
    
    setUploading(prev => ({ ...prev, [index]: true }));
    
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `trusted-brands/${fileName}`;
      
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
        // Update the form field
        const imageUrl = publicUrlData.publicUrl;
        const altText = fields[index]?.name || 'Brand logo';
        
        // Update the specific form field
        const updatedFields = [...fields];
        updatedFields[index] = {
          ...updatedFields[index],
          imageSrc: imageUrl,
          altText: `${altText} logo`
        };
        
        reset({ brands: updatedFields });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setSaveMessage('Error uploading image. Please try again.');
    } finally {
      setUploading(prev => ({ ...prev, [index]: false }));
    }
  };

  if (brandsLoading) {
    return <div className="p-4">Loading trusted brands...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error loading trusted brands: {error.message}</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-[#152f59]">Trusted Brands Editor</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <button
            type="button"
            onClick={() => append({ name: '', imageSrc: '', altText: '' })}
            className="btn btn-sm bg-[#7ac144] text-white hover:bg-[#6ca038]"
          >
            Add Brand
          </button>
        </div>
        
        {fields.length === 0 && (
          <div className="text-gray-500 mb-4">No brands added yet. Click "Add Brand" to get started.</div>
        )}
        
        {fields.map((field, index) => (
          <div key={field.id} className="mb-6 p-4 border border-gray-200 rounded-md">
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">Brand #{index + 1}</h3>
              <button
                type="button"
                onClick={() => remove(index)}
                className="btn btn-sm btn-error btn-outline"
              >
                Remove
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name
                </label>
                <Controller
                  name={`brands.${index}.name`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="e.g., American Standard"
                    />
                  )}
                />
                {errors.brands?.[index]?.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.brands[index]?.name?.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Logo
                </label>
                <div className="flex items-center space-x-2">
                  <Controller
                    name={`brands.${index}.imageSrc`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="input input-bordered w-full"
                        placeholder="Image URL"
                        readOnly
                      />
                    )}
                  />
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(index, file);
                      }}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                    <button
                      type="button"
                      className={`btn btn-sm ${uploading[index] ? 'loading' : ''}`}
                      disabled={uploading[index]}
                    >
                      {uploading[index] ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </div>
                {errors.brands?.[index]?.imageSrc && (
                  <p className="text-red-500 text-sm mt-1">{errors.brands[index]?.imageSrc?.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <Controller
                  name={`brands.${index}.altText`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="input input-bordered w-full"
                      placeholder="e.g., American Standard logo"
                    />
                  )}
                />
                {errors.brands?.[index]?.altText && (
                  <p className="text-red-500 text-sm mt-1">{errors.brands[index]?.altText?.message}</p>
                )}
              </div>
              
              {field.imageSrc && (
                <div className="flex items-center justify-center">
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-md">
                    <img
                      src={field.imageSrc}
                      alt={field.altText || 'Brand logo'}
                      className="max-h-24 max-w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="flex justify-between items-center mt-6">
          <div>
            {saveMessage && (
              <p className={`text-sm ${saveMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                {saveMessage}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="btn bg-[#152f59] text-white hover:bg-[#0f2340]"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Trusted Brands'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrustedBrandsEditor;