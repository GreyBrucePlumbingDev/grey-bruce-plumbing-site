import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { supabase } from '../../lib/supabase';
import { ServiceContent } from '../../types/ServiceTypes';
import { Trash2, Plus, Save, RefreshCw, Image as ImageIcon } from 'lucide-react';
import TipTap from '../TipTap';

// Zod schema for form validation
const benefitSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  iconName: z.string().optional(),
});

const problemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  solution: z.string().optional(),
});

const processStepSchema = z.object({
  id: z.string().optional(),
  stepNumber: z.number().min(1, "Step number is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().optional(),
});

const relatedServiceSchema = z.object({
    id: z.string().min(1, "Please select a service"),
    title: z.string(),
    slug: z.string(),
    description: z.string(),
    imageUrl: z.string().optional(),
});

const serviceSchema = z.object({
    id: z.string().optional(),
    slug: z.string().optional(),
    title: z.string().min(1, "Title is required"),
    overview: z.string().min(1, "Overview is required"),
    summary: z.string().min(1, "Summary is required"),
    imageUrl: z.string().optional(),
    benefits: z.array(benefitSchema),
    commonProblems: z.array(problemSchema),
    process: z.array(processStepSchema),
    relatedServices: z.array(relatedServiceSchema).optional(),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

const ServicesEditor: React.FC = () => {
  const [services, setServices] = useState<ServiceContent[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [, setAvailableServices] = useState<ServiceContent[]>([]);

  const methods = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      overview: '',
      summary: '',
      imageUrl: '',
      benefits: [{ title: '', description: '' }],
      commonProblems: [{ title: '', description: '', solution: '' }],
      process: [{ stepNumber: 1, title: '', description: '' }],
      relatedServices: [],
    },
  });

  const { 
    control, 
    handleSubmit, 
    reset, 
    watch, 
    setValue,
    formState: { errors, isDirty }
  } = methods;

  // Use field arrays for the nested arrays
  const benefitsArray = useFieldArray({
    control,
    name: "benefits",
  });

  const problemsArray = useFieldArray({
    control,
    name: "commonProblems",
  });

  const processArray = useFieldArray({
    control,
    name: "process",
  });

  const relatedServicesArray = useFieldArray({
    control,
    name: "relatedServices",
  });

  // Fetch all services
  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('title');

      if (error) throw error;
      setServices(data || []);
      setAvailableServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setIsLoading(false);
    }
  };

  // Load a specific service for editing
  const loadService = async (serviceId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (error) throw error;
      
      if (data) {
        // Parse JSON strings if needed
        const parsedData = {
          ...data,
          benefits: typeof data.benefits === 'string' ? JSON.parse(data.benefits) : data.benefits,
          commonProblems: typeof data.commonProblems === 'string' ? JSON.parse(data.commonProblems) : data.commonProblems,
          process: typeof data.process === 'string' ? JSON.parse(data.process) : data.process,
          relatedServices: typeof data.relatedServices === 'string' ? JSON.parse(data.relatedServices) : data.relatedServices,
        };
        
        reset(parsedData);
        setSelectedService(serviceId);
      }
    } catch (error) {
      console.error('Error loading service:', error);
      toast.error('Failed to load service details');
    } finally {
      setIsLoading(false);
    }
  };

  // Create new service form
  const createNewService = () => {
    reset({
      slug: '',
      title: '',
      overview: '',
      summary: '',
      imageUrl: '',
      benefits: [{ title: '', description: '' }],
      commonProblems: [{ title: '', description: '', solution: '' }],
      process: [{ stepNumber: 1, title: '', description: '' }],
      relatedServices: [],  // Changed to empty array since it's now optional
    });
    setSelectedService(null);
    setIsCreatingNew(true);
  };

    const generateSlug = (title: string) => {
        return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
        .trim();                  // Trim leading/trailing spaces or hyphens
    };
  
  // Update the onSubmit function
  const onSubmit = async (data: ServiceFormData) => {
    console.log('Form data:', data);
    console.log('is creating new:', isCreatingNew);
    console.log('selected service:', selectedService);

    setIsSaving(true);
    try {
      // Generate slug from title if not provided
      if (!data.slug || data.slug.trim() === '') {
        data.slug = generateSlug(data.title);
      }
      
      // Ensure all arrays have unique IDs
      data.benefits = data.benefits.map((item, index) => ({
        ...item,
        id: item.id || `benefit-${index}-${Date.now()}`
      }));
      
      data.commonProblems = data.commonProblems.map((item, index) => ({
        ...item,
        id: item.id || `problem-${index}-${Date.now()}`
      }));
      
      data.process = data.process.map((item, index) => ({
        ...item,
        id: item.id || `step-${index}-${Date.now()}`
      }));
      
      data.relatedServices = data.relatedServices?.map((item, index) => ({
        ...item,
        id: item.id || `related-${index}-${Date.now()}`
      })) || [];
  
      if (selectedService && !isCreatingNew) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update(data)
          .eq('id', selectedService);
  
        if (error) throw error;
        toast.success('Service updated successfully');
      } else {
        // Create new service
        const { data: newService, error } = await supabase
          .from('services')
          .insert([data])
          .select();
  
        if (error) throw error;
        
        if (newService && newService.length > 0) {
          setSelectedService(newService[0].id);
          toast.success('Service created successfully');
        }
      }
      
      setIsCreatingNew(false);
      fetchServices(); // Refresh the list
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a service
  const deleteService = async () => {
    if (!selectedService) return;
    
    if (!window.confirm('Are you sure you want to delete this service? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', selectedService);

      if (error) throw error;
      
      toast.success('Service deleted successfully');
      setSelectedService(null);
      reset();
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `service-images/${fileName}`;
    
    setImageUploading(true);
    
    try {
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage.from('assets').getPublicUrl(filePath);
      
      if (data && data.publicUrl) {
        // Set the URL to the appropriate field
        setValue(field as any, data.publicUrl, { shouldDirty: true });
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  // Load services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#152f59]">Services Editor</h2>
        <button 
          onClick={createNewService}
          className="btn btn-primary bg-[#7ac144] hover:bg-[#68a93a] border-none" 
          disabled={isLoading}
        >
          <Plus size={18} /> New Service
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Services List */}
        <div className="lg:col-span-1 bg-gray-50 p-4 rounded-lg h-[calc(100vh-14rem)] overflow-y-auto">
          <h3 className="font-semibold text-lg mb-3 text-[#152f59]">Services</h3>
          
          {isLoading ? (
            <div className="flex justify-center p-4">
              <RefreshCw className="animate-spin text-[#152f59]" />
            </div>
          ) : (
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.id}>
                  <button
                    onClick={() => loadService(service.id)}
                    className={`w-full text-left p-3 rounded hover:bg-gray-200 transition ${
                      selectedService === service.id ? 'bg-gray-200 font-medium' : ''
                    }`}
                  >
                    {service.title}
                    <span className="text-xs text-gray-500 block">/{service.slug}</span>
                  </button>
                </li>
              ))}
              {services.length === 0 && (
                <p className="text-gray-500 text-center p-4">No services found</p>
              )}
            </ul>
          )}
        </div>

        {/* Service Form */}
        <div className="lg:col-span-3">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-4 text-[#152f59]">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                    <label className="label">
                        <span className="label-text font-medium">Service Title*</span>
                    </label>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                        <input 
                            {...field} 
                            type="text"
                            placeholder="e.g. Residential Plumbing Services"
                            className="input input-bordered w-full" 
                        />
                        )}
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                    </div>
                    
                </div>
                
                <div className="mb-4">
                    <label className="label">
                    <span className="label-text font-medium">Service Overview*</span>
                    </label>
                    <Controller
                    name="overview"
                    control={control}
                    render={({ field }) => (
                        <TipTap
                            initialContent={field.value}
                            onSave={(content) => field.onChange(content)}
                            editorHeight="min-h-[150px]"
                        />
                    )}
                    />
                    {errors.overview && (
                    <p className="text-red-500 text-sm mt-1">{errors.overview.message}</p>
                    )}
                </div>
                
                <div className="mb-4">
                    <label className="label">
                    <span className="label-text font-medium">Short Summary*</span>
                    </label>
                    <Controller
                    name="summary"
                    control={control}
                    render={({ field }) => (
                        <TipTap
                            initialContent={field.value}
                            onSave={(content) => field.onChange(content)}
                            editorHeight="min-h-[100px]"
                        />
                    )}
                    />
                    {errors.summary && (
                    <p className="text-red-500 text-sm mt-1">{errors.summary.message}</p>
                    )}
                </div>
                
                <div>
                    <label className="label">
                        <span className="label-text font-medium">Featured Image</span>
                    </label>
                    <div className="flex items-center space-x-4">
                        <Controller
                        name="imageUrl"
                        control={control}
                        render={({ field }) => (
                            <>
                            <input 
                                {...field} 
                                type="text"
                                placeholder="Image URL"
                                className="input input-bordered w-full" 
                            />
                            {field.value && (
                                <div className="avatar">
                                <div className="w-12 h-12 rounded">
                                    <img src={field.value} alt="Preview" />
                                </div>
                                </div>
                            )}
                            </>
                        )}
                        />
                        <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "imageUrl")}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={imageUploading}
                        />
                        <button 
                            type="button" 
                            className="btn btn-outline btn-sm"
                            disabled={imageUploading}
                        >
                            {imageUploading ? (
                            <RefreshCw size={16} className="animate-spin" />
                            ) : (
                            <ImageIcon size={16} />
                            )}
                            Upload
                        </button>
                        </div>
                    </div>
                </div>
            </div>
              
              {/* Benefits Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-[#152f59]">Benefits</h3>
                  <button
                    type="button"
                    onClick={() => benefitsArray.append({ title: '', description: '' })}
                    className="btn btn-sm btn-outline"
                  >
                    <Plus size={16} /> Add Benefit
                  </button>
                </div>
                
                {benefitsArray.fields.map((field, index) => (
                  <div key={field.id} className="bg-white p-4 rounded-lg mb-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Benefit {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => benefitsArray.remove(index)}
                        className="btn btn-ghost btn-sm text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <label className="label">
                        <span className="label-text">Title*</span>
                      </label>
                      <Controller
                        name={`benefits.${index}.title`}
                        control={control}
                        render={({ field }) => (
                          <input {...field} type="text" className="input input-bordered w-full" />
                        )}
                      />
                      {errors.benefits?.[index]?.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.benefits[index]?.title?.message}</p>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label className="label">
                        <span className="label-text">Description*</span>
                      </label>
                      <Controller
                        name={`benefits.${index}.description`}
                        control={control}
                        render={({ field }) => (
                            <TipTap
                              initialContent={field.value || ''}
                              onSave={(content) => field.onChange(content)}
                              editorHeight="min-h-[120px]"
                            />
                        )}
                      />
                      {errors.benefits?.[index]?.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.benefits[index]?.description?.message}</p>
                      )}
                    </div>
                    
                  </div>
                ))}
                
                {benefitsArray.fields.length === 0 && (
                  <p className="text-gray-500 text-center p-4">No benefits added yet</p>
                )}
              </div>
              
              {/* Common Problems Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-[#152f59]">Common Problems</h3>
                  <button
                    type="button"
                    onClick={() => problemsArray.append({ title: '', description: '', solution: '' })}
                    className="btn btn-sm btn-outline"
                  >
                    <Plus size={16} /> Add Problem
                  </button>
                </div>
                
                {problemsArray.fields.map((field, index) => (
                  <div key={field.id} className="bg-white p-4 rounded-lg mb-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Problem {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => problemsArray.remove(index)}
                        className="btn btn-ghost btn-sm text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <label className="label">
                        <span className="label-text">Title*</span>
                      </label>
                      <Controller
                        name={`commonProblems.${index}.title`}
                        control={control}
                        render={({ field }) => (
                          <input {...field} type="text" className="input input-bordered w-full" />
                        )}
                      />
                      {errors.commonProblems?.[index]?.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.commonProblems[index]?.title?.message}</p>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label className="label">
                        <span className="label-text">Description*</span>
                      </label>
                      <Controller
                        name={`commonProblems.${index}.description`}
                        control={control}
                        render={({ field }) => (
                            <TipTap
                              initialContent={field.value}
                              onSave={(content) => field.onChange(content)}
                              editorHeight="min-h-[120px]"
                            />
                        )}
                      />
                      {errors.commonProblems?.[index]?.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.commonProblems[index]?.description?.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="label">
                        <span className="label-text">Solution</span>
                      </label>
                      <Controller
                        name={`commonProblems.${index}.solution`}
                        control={control}
                        render={({ field }) => (
                            <TipTap
                              initialContent={field.value || ''}
                              onSave={(content) => field.onChange(content)}
                              editorHeight="min-h-[120px]"
                            />
                        )}
                      />
                    </div>
                  </div>
                ))}
                
                {problemsArray.fields.length === 0 && (
                  <p className="text-gray-500 text-center p-4">No common problems added yet</p>
                )}
              </div>
              
              {/* Service Process Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-[#152f59]">Service Process</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const nextStep = processArray.fields.length + 1;
                      processArray.append({ stepNumber: nextStep, title: '', description: '' });
                    }}
                    className="btn btn-sm btn-outline"
                  >
                    <Plus size={16} /> Add Step
                  </button>
                </div>
                
                {processArray.fields.map((field, index) => (
                  <div key={field.id} className="bg-white p-4 rounded-lg mb-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Step {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => processArray.remove(index)}
                        className="btn btn-ghost btn-sm text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="mb-3">
                      <label className="label">
                        <span className="label-text">Step Number*</span>
                      </label>
                      <Controller
                        name={`process.${index}.stepNumber`}
                        control={control}
                        render={({ field }) => (
                          <input 
                            {...field} 
                            type="number" 
                            className="input input-bordered w-full"
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          />
                        )}
                      />
                      {errors.process?.[index]?.stepNumber && (
                        <p className="text-red-500 text-sm mt-1">{errors.process[index]?.stepNumber?.message}</p>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label className="label">
                        <span className="label-text">Title*</span>
                      </label>
                      <Controller
                        name={`process.${index}.title`}
                        control={control}
                        render={({ field }) => (
                          <input {...field} type="text" className="input input-bordered w-full" />
                        )}
                      />
                      {errors.process?.[index]?.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.process[index]?.title?.message}</p>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label className="label">
                        <span className="label-text">Description*</span>
                      </label>
                      <Controller
                        name={`process.${index}.description`}
                        control={control}
                        render={({ field }) => (
                            <TipTap
                              initialContent={field.value}
                              onSave={(content) => field.onChange(content)}
                              editorHeight="min-h-[120px]"
                            />
                        )}
                      />
                      {errors.process?.[index]?.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.process[index]?.description?.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="label">
                        <span className="label-text">Image (optional)</span>
                      </label>
                      <div className="flex items-center space-x-4">
                        <Controller
                          name={`process.${index}.imageUrl`}
                          control={control}
                          render={({ field }) => (
                            <>
                              <input 
                                {...field} 
                                type="text" 
                                className="input input-bordered w-full"
                                placeholder="Image URL" 
                              />
                              {field.value && (
                                <div className="avatar">
                                  <div className="w-12 h-12 rounded">
                                    <img src={field.value} alt="Preview" />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        />
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, `process.${index}.imageUrl`)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={imageUploading}
                          />
                          <button 
                            type="button" 
                            className="btn btn-outline btn-sm"
                            disabled={imageUploading}
                          >
                            {imageUploading ? (
                              <RefreshCw size={16} className="animate-spin" />
                            ) : (
                              <ImageIcon size={16} />
                            )}
                            Upload
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {processArray.fields.length === 0 && (
                  <p className="text-gray-500 text-center p-4">No process steps added yet</p>
                )}
              </div>
              
            {/* Related Services Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg text-[#152f59]">Related Services</h3>
                <button
                type="button"
                onClick={() => relatedServicesArray.append({ id: '', title: '', slug: '', description: '' })}
                className="btn btn-sm btn-outline"
                >
                <Plus size={16} /> Add Related Service
                </button>
            </div>
            
            {relatedServicesArray.fields.map((field, index) => (
                <div key={field.id} className="bg-white p-4 rounded-lg mb-4 border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">Related Service {index + 1}</h4>
                    <button
                    type="button"
                    onClick={() => relatedServicesArray.remove(index)}
                    className="btn btn-ghost btn-sm text-red-500"
                    >
                    <Trash2 size={16} />
                    </button>
                </div>
                
                <div className="mb-3">
                    <label className="label">
                    <span className="label-text">Select Service</span>
                    </label>
                    <Controller
                    name={`relatedServices.${index}.id`}
                    control={control}
                    render={({ field }) => (
                        <select 
                        {...field} 
                        className="select select-bordered w-full"
                        onChange={(e) => {
                            field.onChange(e.target.value);
                            
                            // Find the selected service
                            const selectedService = services.find(service => service.id === e.target.value);
                            if (selectedService) {
                            // Auto-fill other fields
                            setValue(`relatedServices.${index}.title`, selectedService.title);
                            setValue(`relatedServices.${index}.slug`, selectedService.slug);
                            setValue(`relatedServices.${index}.description`, selectedService.overview);
                            setValue(`relatedServices.${index}.imageUrl`, selectedService.imageUrl || '');
                            }
                        }}
                        >
                        <option value="">Select a service</option>
                        {services
                            .filter(service => service.id !== selectedService) // Filter out the current service
                            .map(service => (
                            <option key={service.id} value={service.id}>
                                {service.title}
                            </option>
                            ))
                        }
                        </select>
                    )}
                    />
                </div>
                
                {/* Display the selected service info (read-only) */}
                {watch(`relatedServices.${index}.title`) && (
                    <div className="space-y-2 p-3 bg-gray-50 rounded mt-2">
                    <div className="text-sm">
                        <span className="font-medium">Title:</span> {watch(`relatedServices.${index}.title`)}
                    </div>
                    <div className="text-sm">
                        <span className="font-medium">Slug:</span> {watch(`relatedServices.${index}.slug`)}
                    </div>
                    <div className="text-sm">
                        <span className="font-medium">Description:</span> {watch(`relatedServices.${index}.description`)}
                    </div>
                    {watch(`relatedServices.${index}.imageUrl`) && (
                        <div className="avatar">
                        <div className="w-12 h-12 rounded">
                            <img src={watch(`relatedServices.${index}.imageUrl`)} alt="Preview" />
                        </div>
                        </div>
                    )}
                    </div>
                )}
                </div>
            ))}
            
            {relatedServicesArray.fields.length === 0 && (
                <p className="text-gray-500 text-center p-4">No related services added yet</p>
            )}
            </div>
              
              {/* Form Actions */}
              <div className="flex justify-between items-center pt-4">
                {selectedService && !isCreatingNew ? (
                  <button
                    type="button"
                    onClick={deleteService}
                    className="btn btn-error"
                    disabled={isLoading || isSaving}
                  >
                    <Trash2 size={18} /> Delete Service
                  </button>
                ) : (
                  <div></div>
                )}
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedService && !isCreatingNew) {
                        loadService(selectedService);
                      } else {
                        createNewService();
                      }
                    }}
                    className="btn btn-outline"
                    disabled={isLoading || isSaving || !isDirty}
                  >
                    <RefreshCw size={18} /> Reset
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-primary bg-[#7ac144] hover:bg-[#68a93a] border-none"
                    disabled={isLoading || isSaving || !isDirty}
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} /> Save Service
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default ServicesEditor;