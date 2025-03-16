import React from 'react';

const ServiceAreaMap: React.FC = () => {
  // List of service areas
  const serviceAreas = [
    'Owen Sound',
    'Georgian Bluffs',
    'Chatsworth',
    'Collingwood',
    'Thornbury',
    'Meaford',
    'Saugeen Shores',
    'Port Elgin',
    'Southampton'
  ];

  return (
    <div id="serviceArea" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#152f59] mb-12">
          Our Service Area
        </h2>
        
        <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
          {/* Map Section - Left side */}
          <div className="lg:w-1/2">
            <div className="h-96 md:h-[500px] w-full rounded-lg overflow-hidden shadow-md">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d181139.35491623414!2d-81.0290367752998!3d44.56533336299504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4d2677add6ad0c49%3A0xcd0a20e1c3df8cb0!2sOwen%20Sound%2C%20ON!5e0!3m2!1sen!2sca!4v1710616249012!5m2!1sen!2sca" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Grey-Bruce Area Map"
              ></iframe>
            </div>
          </div>
          
          {/* Service Areas List - Right side */}
          <div className="lg:w-1/2">
            <div className="bg-white rounded-lg shadow-md p-8 h-full">
              <h3 className="text-2xl font-bold text-[#152f59] mb-6">
                Communities We Serve
              </h3>
              
              <div className="space-y-4">
                {serviceAreas.map((area, index) => (
                  <div 
                    key={index} 
                    className="flex items-center p-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="w-6 h-6 rounded-full bg-[#7ac144] flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <span className="text-lg text-gray-700">{area}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600">
                  Don't see your location? We may still be able to help! 
                  Contact us to check if we service your area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceAreaMap;