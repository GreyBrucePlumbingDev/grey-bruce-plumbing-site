import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define types for our form data
interface SitewideSettings {
  id?: string;
  company_name: string;
  company_logo_url: string;
  phone_number: string;
  emergency_phone: string;
  email: string;
  email2?: string;
  business_hours: string;
  booking_link: string;
  footer_text: string;
  // Address 1
  address1_line: string;
  address1_city: string;
  address1_province: string;
  address1_postal_code: string;
  address1_phone: string; // Added phone number for address 1
  // Address 2
  address2_line?: string;
  address2_city?: string;
  address2_province?: string;
  address2_postal_code?: string;
  address2_phone?: string; // Added phone number for address 2
  // Social media
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  linkedin_url: string;
  created_at?: string;
  updated_at?: string;
}

// Define Zod schema for validation
const sitewideSettingsSchema = z.object({
  id: z.string().optional(),
  company_name: z.string().min(1, 'Company name is required'),
  company_logo_url: z.string().url('Must be a valid URL').or(z.string().length(0)),
  phone_number: z.string().min(1, 'Phone number is required'),
  emergency_phone: z.string().min(1, 'Emergency contact number is required'),
  email: z.string().email('Must be a valid email address'),
  email2: z.string().email('Must be a valid email address').optional(),
  business_hours: z.string().min(1, 'Business hours are required'),
  booking_link: z.string().url('Must be a valid URL').or(z.string().length(0)),
  footer_text: z.string().min(1, 'Footer text is required'),
  // Address 1 - Required
  address1_line: z.string().min(1, 'Address line is required'),
  address1_city: z.string().min(1, 'City is required'),
  address1_province: z.string().min(1, 'Province is required'),
  address1_postal_code: z.string().min(1, 'Postal code is required'),
  address1_phone: z.string().min(1, 'Phone number is required'),
  // Address 2 - Optional
  address2_line: z.string().optional(),
  address2_city: z.string().optional(),
  address2_province: z.string().optional(),
  address2_postal_code: z.string().optional(),
  address2_phone: z.string().optional(),
  // Social media - Optional URLs
  facebook_url: z.string().url('Must be a valid URL').or(z.string().length(0)),
  twitter_url: z.string().url('Must be a valid URL').or(z.string().length(0)),
  instagram_url: z.string().url('Must be a valid URL').or(z.string().length(0)),
  linkedin_url: z.string().url('Must be a valid URL').or(z.string().length(0)),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

const SitewideSettingsEditor: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Initialize form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SitewideSettings>({
    resolver: zodResolver(sitewideSettingsSchema),
    defaultValues: {
      id: '',
      company_name: '',
      company_logo_url: '',
      phone_number: '',
      emergency_phone: '',
      email: '',
      email2: '',
      business_hours: '',
      booking_link: '',
      footer_text: '',
      address1_line: '',
      address1_city: '',
      address1_province: '',
      address1_postal_code: '',
      address1_phone: '', 
      address2_line: '',
      address2_city: '',
      address2_province: '',
      address2_postal_code: '',
      address2_phone: '',
      facebook_url: '',
      twitter_url: '',
      instagram_url: '',
      linkedin_url: '',
      created_at: '',
      updated_at: '',
    },
  });

  // Load existing settings from Supabase
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sitewide_settings')
        .select('*')
        .limit(1);
  
      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }
  
      if (data && data.length > 0) {
        reset(data[0]);
        if (data[0].company_logo_url) {
          setLogoPreview(data[0].company_logo_url);
        }
      } else {
        console.log('No existing settings found, using default values');
        // Continue with default values that are already set
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle logo file change
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload logo to Supabase storage
  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;
    
    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, logoFile);
        
      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
        return null;
      }
      
      // Get public URL
      const { data } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
      
    } catch (err) {
      console.error('Error uploading:', err);
      return null;
    }
  };

  // Save settings to Supabase
  const onSubmit = async (formData: SitewideSettings) => {
    console.log("saving")
    setSaveStatus('saving');
    
    try {
      // Generate a UUID if one doesn't exist
      if (!formData.id) {
        formData.id = crypto.randomUUID(); // Browser API for UUID generation
      }
      
      // Upload logo if there's a new one
      if (logoFile) {
        const logoUrl = await uploadLogo();
        if (logoUrl) {
          formData.company_logo_url = logoUrl;
        }
      }
  
      // Check if settings already exist
      const { data: existingData } = await supabase
        .from('sitewide_settings')
        .select('id')
        .limit(1);
  
      let result;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        result = await supabase
          .from('sitewide_settings')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingData[0].id);
      } else {
        // Insert new record
        result = await supabase
          .from('sitewide_settings')
          .insert({
            ...formData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
      }
  
      if (result.error) {
        console.error('Error saving settings:', result.error);
        setSaveStatus('error');
        return;
      }
  
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
      fetchSettings(); // Refresh data
      
    } catch (err) {
      console.error('Error saving:', err);
      setSaveStatus('error');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Sitewide Settings</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      ) : (
        <form onSubmit={(e) => {
            console.log("Form submitted");
            console.log("Form errors:", errors);
            handleSubmit(onSubmit)(e);
          }} className="space-y-6">
          {/* Company Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Company Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Company Name</span>
                </label>
                <input
                  type="text"
                  {...register('company_name')}
                  className={`input input-bordered w-full ${errors.company_name ? 'input-error' : ''}`}
                />
                {errors.company_name && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.company_name.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Phone Number</span>
                </label>
                <input
                  type="text"
                  {...register('phone_number')}
                  className={`input input-bordered w-full ${errors.phone_number ? 'input-error' : ''}`}
                />
                {errors.phone_number && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.phone_number.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Emergency Contact Number</span>
                </label>
                <input
                  type="text"
                  {...register('emergency_phone')}
                  className={`input input-bordered w-full ${errors.emergency_phone ? 'input-error' : ''}`}
                />
                {errors.emergency_phone && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.emergency_phone.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Email Address</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.email.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Email Address 2</span>
                </label>
                <input
                  type="email"
                  {...register('email2')}
                  className={`input input-bordered w-full ${errors.email2 ? 'input-error' : ''}`}
                />
                {errors.email && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.email.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Business Hours</span>
                </label>
                <input
                  type="text"
                  {...register('business_hours')}
                  placeholder="e.g., Mon-Fri: 8am-6pm, Sat: 9am-2pm"
                  className={`input input-bordered w-full ${errors.business_hours ? 'input-error' : ''}`}
                />
                {errors.business_hours && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.business_hours.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Booking Link</span>
                </label>
                <input
                  type="text"
                  {...register('booking_link')}
                  placeholder="https://booking.example.com"
                  className={`input input-bordered w-full ${errors.booking_link ? 'input-error' : ''}`}
                />
                {errors.booking_link && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.booking_link.message}</span>
                  </label>
                )}
              </div>
            </div>

            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text font-medium">Company Logo</span>
              </label>
              
              {logoPreview && (
                <div className="mb-4">
                  <img src={logoPreview} alt="Logo Preview" className="h-16 object-contain" />
                </div>
              )}
              
              <input
                type="file"
                onChange={handleLogoChange}
                accept="image/*"
                className="file-input file-input-bordered w-full max-w-xs"
              />
              <label className="label">
                <span className="label-text-alt">Recommended size: 200x60px</span>
              </label>
            </div>
          </div>

          {/* Primary Address Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Primary Address</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">Address Line</span>
                </label>
                <input
                  type="text"
                  {...register('address1_line')}
                  className={`input input-bordered w-full ${errors.address1_line ? 'input-error' : ''}`}
                />
                {errors.address1_line && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.address1_line.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">City</span>
                </label>
                <input
                  type="text"
                  {...register('address1_city')}
                  className={`input input-bordered w-full ${errors.address1_city ? 'input-error' : ''}`}
                />
                {errors.address1_city && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.address1_city.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Province</span>
                </label>
                <input
                  type="text"
                  {...register('address1_province')}
                  className={`input input-bordered w-full ${errors.address1_province ? 'input-error' : ''}`}
                />
                {errors.address1_province && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.address1_province.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Postal Code</span>
                </label>
                <input
                  type="text"
                  {...register('address1_postal_code')}
                  className={`input input-bordered w-full ${errors.address1_postal_code ? 'input-error' : ''}`}
                />
                {errors.address1_postal_code && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.address1_postal_code.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Location Phone</span>
                </label>
                <input
                  type="text"
                  {...register('address1_phone')}
                  className={`input input-bordered w-full ${errors.address1_phone ? 'input-error' : ''}`}
                />
                {errors.address1_phone && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.address1_phone.message}</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Secondary Address Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Secondary Address (Optional)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">Address Line</span>
                </label>
                <input
                  type="text"
                  {...register('address2_line')}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">City</span>
                </label>
                <input
                  type="text"
                  {...register('address2_city')}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Province</span>
                </label>
                <input
                  type="text"
                  {...register('address2_province')}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Postal Code</span>
                </label>
                <input
                  type="text"
                  {...register('address2_postal_code')}
                  className="input input-bordered w-full"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Location Phone</span>
                </label>
                <input
                  type="text"
                  {...register('address2_phone')}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Footer Information</h3>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Footer Description</span>
              </label>
              <textarea
                {...register('footer_text')}
                className={`textarea textarea-bordered h-24 w-full ${errors.footer_text ? 'textarea-error' : ''}`}
                placeholder="Short company description for the footer"
              ></textarea>
              {errors.footer_text && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.footer_text.message}</span>
                </label>
              )}
            </div>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Social Media</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Facebook URL</span>
                </label>
                <input
                  type="text"
                  {...register('facebook_url')}
                  placeholder="https://facebook.com/yourpage"
                  className={`input input-bordered w-full ${errors.facebook_url ? 'input-error' : ''}`}
                />
                {errors.facebook_url && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.facebook_url.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Twitter URL</span>
                </label>
                <input
                  type="text"
                  {...register('twitter_url')}
                  placeholder="https://twitter.com/yourhandle"
                  className={`input input-bordered w-full ${errors.twitter_url ? 'input-error' : ''}`}
                />
                {errors.twitter_url && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.twitter_url.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">Instagram URL</span>
                </label>
                <input
                  type="text"
                  {...register('instagram_url')}
                  placeholder="https://instagram.com/yourhandle"
                  className={`input input-bordered w-full ${errors.instagram_url ? 'input-error' : ''}`}
                />
                {errors.instagram_url && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.instagram_url.message}</span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">LinkedIn URL</span>
                </label>
                <input
                  type="text"
                  {...register('linkedin_url')}
                  placeholder="https://linkedin.com/company/yourcompany"
                  className={`input input-bordered w-full ${errors.linkedin_url ? 'input-error' : ''}`}
                />
                {errors.linkedin_url && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.linkedin_url.message}</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              className={`btn btn-primary ${saveStatus === 'saving' ? 'loading' : ''}`}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          {/* Status Messages */}
          {saveStatus === 'success' && (
            <div className="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Settings saved successfully!</span>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Error saving settings. Please try again.</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default SitewideSettingsEditor;
