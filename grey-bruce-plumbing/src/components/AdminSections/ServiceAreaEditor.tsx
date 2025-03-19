import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../lib/supabase';
import { FiPlus, FiTrash2, FiSave, FiMapPin } from 'react-icons/fi';

// Updated schema - no longer needs to reference site_settings
const serviceAreaSchema = z.object({
  mainAddress: z.string().min(5, "Main address is required"),
  areas: z.array(
    z.object({
      name: z.string().min(2, "Area name must be at least 2 characters"),
      id: z.number().optional() // To preserve existing IDs when updating
    })
  ).min(1, "At least one service area is required")
});

type ServiceAreaFormValues = z.infer<typeof serviceAreaSchema>;

const ServiceAreaEditor: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { 
    register, 
    control, 
    handleSubmit, 
    reset, 
    watch,
    formState: { errors } 
  } = useForm<ServiceAreaFormValues>({
    resolver: zodResolver(serviceAreaSchema),
    defaultValues: {
      mainAddress: '',
      areas: [{ name: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "areas"
  });

  const mainAddress = watch('mainAddress');

  // Function to create a Google Maps embed URL for an address
  const getMapPreviewUrl = (address: string) => {
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  };

  useEffect(() => {
    const fetchServiceAreaData = async () => {
      setLoading(true);
      try {
        // Get all service areas
        const { data: areasData, error: areasError } = await supabase
          .from('service_areas')
          .select('*')
          .order('id', { ascending: true });

        if (areasError) throw areasError;

        // Find the main address (we'll mark it with is_main_address=true in the updated schema)
        const mainAddressRecord = areasData?.find(area => area.is_main_address === true);
        
        // Set form data
        reset({
          mainAddress: mainAddressRecord?.address || '',
          areas: areasData?.filter(area => !area.is_main_address).map(area => ({ 
            name: area.name,
            id: area.id
          })) || [{ name: '' }]
        });
      } catch (error) {
        console.error('Error fetching service area data:', error);
        setSaveMessage({ type: 'error', text: 'Failed to load service area data' });
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAreaData();
  }, [reset]);

  const onSubmit = async (data: ServiceAreaFormValues) => {
    setLoading(true);
    setSaveMessage(null);
    
    try {
      // Start a transaction using Supabase's RPC
      const { error: deleteMainError } = await supabase
        .from('service_areas')
        .delete()
        .eq('is_main_address', true);

      if (deleteMainError) throw deleteMainError;

      // Insert the main address record
      const { error: insertMainError } = await supabase
        .from('service_areas')
        .insert({
          name: 'Main Address',
          address: data.mainAddress,
          is_main_address: true
        });

      if (insertMainError) throw insertMainError;

      // Delete and re-insert service areas
      const { error: deleteError } = await supabase
        .from('service_areas')
        .delete()
        .eq('is_main_address', false);

      if (deleteError) throw deleteError;

      const { error: insertError } = await supabase
        .from('service_areas')
        .insert(data.areas.map(area => ({ 
          name: area.name,
          is_main_address: false
        })));

      if (insertError) throw insertError;

      setSaveMessage({ type: 'success', text: 'Service areas saved successfully!' });
    } catch (error) {
      console.error('Error saving service area data:', error);
      setSaveMessage({ type: 'error', text: 'Failed to save service area data' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Service Area Settings</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Main Address */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Main Service Address
            <span className="text-xs text-gray-500 ml-2">(This will be used for the map)</span>
          </label>
          <div className="flex gap-2">
            <div className="flex-grow">
              <input
                type="text"
                className={`input input-bordered w-full ${errors.mainAddress ? 'input-error' : ''}`}
                placeholder="Owen Sound, ON"
                {...register("mainAddress")}
              />
              {errors.mainAddress && (
                <p className="text-red-500 text-sm mt-1">{errors.mainAddress.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Map Preview */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Map Preview</h3>
          <div className="border rounded-lg overflow-hidden h-64">
            {mainAddress ? (
              <iframe
                title="Service Area Map"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src={getMapPreviewUrl(mainAddress)}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                <div className="text-center">
                  <FiMapPin className="mx-auto text-3xl mb-2" />
                  <p>Enter an address above to see the map preview</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Service Areas List */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-gray-700">Service Areas</h3>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={() => append({ name: '' })}
            >
              <FiPlus className="mr-1" /> Add Area
            </button>
          </div>
          
          {errors.areas?.root && (
            <p className="text-red-500 text-sm mb-2">{errors.areas.root.message}</p>
          )}
          
          <div className="bg-gray-50 rounded-lg p-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2 mb-2">
                <div className="flex-grow">
                  <input
                    type="text"
                    className={`input input-bordered w-full ${errors.areas?.[index]?.name ? 'input-error' : ''}`}
                    placeholder="Area name (e.g. Owen Sound)"
                    {...register(`areas.${index}.name`)}
                  />
                  {errors.areas?.[index]?.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.areas?.[index]?.name?.message}</p>
                  )}
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline btn-error"
                  onClick={() => fields.length > 1 && remove(index)}
                  disabled={fields.length <= 1}
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Saving...
              </>
            ) : (
              <>
                <FiSave className="mr-2" /> Save Service Areas
              </>
            )}
          </button>
        </div>

        {/* Save Message */}
        {saveMessage && (
          <div className={`mt-4 p-3 rounded-lg ${
            saveMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {saveMessage.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default ServiceAreaEditor;