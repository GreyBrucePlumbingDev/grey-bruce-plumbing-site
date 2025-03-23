import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ServiceContent } from '../types/ServiceTypes';
import { getServiceBySlug } from '../services/supabaseService';
import { useSitewideSettings } from '../hooks/useSitewideSettings';
import { SitewideSettings } from '../types/SitewideSettings';
import DocumentHead from '../components/DocumentHead';

const ServicePage = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const [service, setService] = useState<ServiceContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSitewideSettings() as { settings: SitewideSettings | null; loading: boolean };

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!serviceSlug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In production, use the real Supabase function
        const serviceData = await getServiceBySlug(serviceSlug);
        console.log('Service Data:', serviceData);
        
        // For development before Supabase is fully set up, use mock data
        setTimeout(() => {
          
          // Set the mock data
          setService(serviceData);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load service information. Please try again later.');
        setIsLoading(false);
        console.error('Error fetching service data:', err);
      }
    };

    fetchServiceData();
  }, [serviceSlug]);

  if (isLoading) {
    return (
      <>
        <DocumentHead pageTitle={service?.title || 'Service'} />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <DocumentHead pageTitle={service?.title || 'Service'} />
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="mt-4">{error}</p>
        </div>
      </>
    );
  }

  if (!service) {
    return (
      <>
        <DocumentHead pageTitle="Service Not Found" />
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold">Service Not Found</h2>
          <p className="mt-4">The requested service information could not be found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <DocumentHead pageTitle={service?.title || 'Service'} />
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#152f59] to-[#25477e] text-white rounded-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h1>
              <p 
                  className="text-white-700 mb-3"
                  dangerouslySetInnerHTML={{ __html: service.overview }}
                  />
              <a 
                href={settings?.booking_link || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-sm sm:btn-md bg-[#7ac144] hover:bg-[#6aad39] text-white border-none mr-1 mb-1 sm:mb-0 sm:mr-2 px-2 sm:px-4 mt-5"
              >
                Book Now
              </a>
            </div>
            <div className="md:w-1/3 flex justify-center">
              {service.imageUrl && (
                <img 
                  src={service.imageUrl} 
                  alt={service.title} 
                  className="rounded-lg max-h-64 object-cover shadow-lg" 
                />
              )}
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        {service.benefits && service.benefits.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#152f59] mb-8">Benefits of Our {service.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {service.benefits.map((benefit) => (
                <div key={benefit.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
                  <h3 className="text-xl font-semibold text-[#152f59] mb-3">{benefit.title}</h3>
                  <p 
                  className="text-gray-700 mb-3"
                  dangerouslySetInnerHTML={{ __html: benefit.description }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Common Problems Section */}
        {service.commonProblems && service.commonProblems.length > 0 && (
          <section className="mb-16 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-[#152f59] mb-8">Common Problems We Solve</h2>
            <div className="space-y-6">
              {service.commonProblems.map((problem) => (
                <div key={problem.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-[#152f59] mb-2">{problem.title}</h3>
                  <p 
                  className="text-gray-700 mb-3"
                  dangerouslySetInnerHTML={{ __html: problem.description }}
                  />
                  {problem.solution && (
                    <div>
                      <span className="font-semibold text-[#7ac144]">Our Solution: </span>
                      <p 
                        className="text-gray-700 mb-3"
                        dangerouslySetInnerHTML={{ __html: problem.solution }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Service Process Section */}
        {service.process && service.process.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#152f59] mb-8">Our Service Process</h2>
            <div className="relative">
              {service.process.map((step, index) => (
                <div key={step.id} className="flex mb-8 relative">
                  <div className="mr-6 relative">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#152f59] text-white font-bold text-xl">
                      {step.stepNumber}
                    </div>
                    {index < service.process.length - 1 && (
                      <div className="absolute top-12 bottom-0 left-6 w-0.5 bg-[#7ac144]"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#152f59] mb-2">{step.title}</h3>
                    <p 
                      className="text-gray-700 mb-3"
                      dangerouslySetInnerHTML={{ __html: step.description }}
                    />
                    {step.imageUrl && (
                      <img 
                        src={step.imageUrl} 
                        alt={step.title} 
                        className="mt-4 rounded-lg max-h-40 object-cover" 
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Services Section */}
        {service.relatedServices && service.relatedServices.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[#152f59] mb-8">Related Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {service.relatedServices.map((relatedService) => (
                <Link 
                  key={relatedService.id} 
                  to={`/services/${relatedService.slug}`}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition duration-300"
                >
                  {relatedService.imageUrl && (
                    <img 
                      src={relatedService.imageUrl} 
                      alt={relatedService.title} 
                      className="w-full h-40 object-cover rounded-lg mb-4" 
                    />
                  )}
                  <h3 className="text-xl font-semibold text-[#152f59] mb-2">{relatedService.title}</h3>
                  <p className="text-gray-700">{relatedService.description}</p>
                  <div className="mt-4 text-[#7ac144] font-semibold flex items-center">
                    Learn More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#152f59] to-[#25477e] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6">Contact us today for professional plumbing services you can trust.</p>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <a 
              href={settings?.booking_link || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-sm sm:btn-md bg-[#7ac144] hover:bg-[#6aad39] text-white border-none mr-1 mb-1 sm:mb-0 sm:mr-2 px-2 sm:px-4"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServicePage;