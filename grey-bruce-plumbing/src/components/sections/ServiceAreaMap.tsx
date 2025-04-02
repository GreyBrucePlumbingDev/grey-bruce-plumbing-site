import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

interface ServiceArea {
  id: number;
  name: string;
  address?: string;
  is_main_address: boolean;
}

const ServiceAreaMap: React.FC = () => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [mainAddress, setMainAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceAreas = async () => {
      setLoading(true);
      try {
        // Get all service areas from Supabase
        const { data, error } = await supabase
          .from('service_areas')
          .select('*')
          .order('id', { ascending: true });

        if (error) throw error;

        if (data) {
          // Find the main address
          const mainAddressRecord = data.find(area => area.is_main_address === true);
          setMainAddress(mainAddressRecord?.address || 'Owen Sound, ON');
          
          // Set service areas (excluding main address)
          setServiceAreas(data.filter(area => !area.is_main_address));
        }
      } catch (err) {
        console.error('Error fetching service areas:', err);
        setError('Failed to load service areas. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceAreas();
  }, []);

  // Function to create a Google Maps embed URL for the main address
  const getMapEmbedUrl = (address: string) => {
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  };

  return (
    <div id="serviceArea" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Map Section - Left side */}
          <div className="lg:w-1/2">
            <div className="h-96 md:h-[500px] w-full rounded-lg overflow-hidden shadow-md">
              {loading ? (
                <div className="h-full w-full flex items-center justify-center bg-gray-100">
                  <div className="loading loading-spinner loading-lg text-[#7ac144]"></div>
                </div>
              ) : (
                <iframe 
                  src={getMapEmbedUrl(mainAddress)}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Service Area Map"
                ></iframe>
              )}
            </div>
          </div>
          
          {/* Service Areas List - Right side */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-8 h-96 md:h-[500px] overflow-y-auto">
              <h3 className="text-2xl font-bold text-[#152f59] mb-6">
                Communities We Serve
              </h3>
              
              {loading ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="loading loading-spinner loading-lg text-[#7ac144]"></div>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              ) : (
                <div className="space-y-4">
                  {serviceAreas.length > 0 ? (
                    serviceAreas.map((area, index) => (
                      <div 
                        key={area.id} 
                        className="flex items-center p-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#7ac144] flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <span className="text-lg text-gray-700">{area.name}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No service areas found.</p>
                  )}
                </div>
              )}
              
              <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600">
                  Don't see your location? We may still be able to help! 
                  Contact us to check if we service your area.
                </p>
              </div>
              <div className="flex justify-center w-full mt-8">
                <Link to='service-areas' className="btn btn-primary bg-[#152f59]">View All Service Areas</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaMap;