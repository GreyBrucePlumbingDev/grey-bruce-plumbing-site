// src/pages/ServicePage.tsx

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ServiceContent } from '../types/serviceTypes';
import { getServiceBySlug } from '../services/supabaseService';

const ServicePage = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>();
  const [service, setService] = useState<ServiceContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!serviceSlug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // In production, use the real Supabase function
        // const serviceData = await getServiceBySlug(serviceSlug);
        
        // For development before Supabase is fully set up, use mock data
        setTimeout(() => {
          // Base mock data template - you can fill this in with your specific service data
          const mockData: ServiceContent = {
            id: '1',
            slug: serviceSlug,
            title: `${serviceSlug.charAt(0).toUpperCase()}${serviceSlug.slice(1)} Plumbing Services`,
            overview: `Our comprehensive ${serviceSlug} plumbing services are designed to meet all your plumbing needs. With our team of licensed professionals, we ensure high-quality workmanship and reliable solutions.`,
            benefits: [
              {
                id: '1',
                title: 'Experienced Technicians',
                description: 'Our plumbers have years of experience handling all types of plumbing issues.'
              },
              {
                id: '2',
                title: 'Quality Workmanship',
                description: 'We stand behind our work with satisfaction guarantees.'
              },
              {
                id: '3',
                title: '24/7 Availability',
                description: 'We offer emergency services when you need them most.'
              }
            ],
            commonProblems: [
              {
                id: '1',
                title: 'Leaky Faucets',
                description: 'Constant dripping that wastes water and increases bills.',
                solution: 'Our technicians can quickly repair or replace faulty components.'
              },
              {
                id: '2',
                title: 'Clogged Drains',
                description: 'Slow drainage or complete blockages in sinks, showers, or toilets.',
                solution: 'We use professional-grade equipment to clear any obstruction.'
              }
            ],
            process: [
              {
                id: '1',
                stepNumber: 1,
                title: 'Initial Consultation',
                description: 'We assess your plumbing needs and provide an estimate.'
              },
              {
                id: '2',
                stepNumber: 2,
                title: 'Service Execution',
                description: 'Our professional plumbers complete the job efficiently.'
              },
              {
                id: '3',
                stepNumber: 3,
                title: 'Final Inspection',
                description: 'We verify everything works properly before we leave.'
              }
            ],
            relatedServices: [
              {
                id: '1',
                title: 'Drain Cleaning',
                slug: 'drain',
                description: 'Professional drain cleaning services to remove clogs and improve flow.'
              },
              {
                id: '2',
                title: 'Water Treatment',
                slug: 'water-treatment',
                description: 'Solutions for better water quality throughout your property.'
              }
            ],
            imageUrl: '/images/services-placeholder.jpg'
          };

          // Custom data based on service slug
          if (serviceSlug === 'residential') {
            mockData.title = 'Residential Plumbing Services';
            mockData.overview = 'Our residential plumbing services cover everything from minor repairs to major installations. We handle leaky faucets, clogged drains, water heater issues, pipe repairs, and more for homeowners.';
            mockData.commonProblems = [
              {
                id: '1',
                title: 'Running Toilets',
                description: 'Wasting water and increasing your utility bills.',
                solution: 'We can quickly diagnose and fix toilet components to stop the continuous running.'
              },
              {
                id: '2',
                title: 'Leaking Pipes',
                description: 'Can cause water damage, mold growth, and structural issues if not addressed promptly.',
                solution: 'Our team provides efficient pipe repairs using durable materials.'
              },
              {
                id: '3',
                title: 'Water Heater Problems',
                description: 'Inconsistent water temperature or complete failure causing discomfort.',
                solution: 'We repair or replace water heaters to restore reliable hot water to your home.'
              }
            ];
            mockData.process = [
              {
                id: '1',
                stepNumber: 1,
                title: 'Assessment Call',
                description: 'We discuss your residential plumbing needs over the phone to understand the issue.'
              },
              {
                id: '2',
                stepNumber: 2,
                title: 'On-Site Evaluation',
                description: 'Our technician visits your home to assess the plumbing situation in person.'
              },
              {
                id: '3',
                stepNumber: 3,
                title: 'Written Estimate',
                description: 'We provide a clear, detailed estimate of the costs before beginning any work.'
              },
              {
                id: '4',
                stepNumber: 4,
                title: 'Service Completion',
                description: 'Our professionals complete the plumbing work with minimal disruption to your home.'
              },
              {
                id: '5',
                stepNumber: 5,
                title: 'Final Walkthrough',
                description: 'We demonstrate the completed work and ensure your complete satisfaction.'
              }
            ];
            mockData.relatedServices = [
              {
                id: '1',
                title: 'Water Heater Services',
                slug: 'water-heater',
                description: 'Installation, repair, and maintenance for all types of water heaters.'
              },
              {
                id: '2',
                title: 'Drain Cleaning',
                slug: 'drain',
                description: 'Professional solutions for clogged or slow drains in your home.'
              },
              {
                id: '3',
                title: 'Water Treatment',
                slug: 'water-treatment',
                description: 'Improve your home water quality with our filtration and softening systems.'
              }
            ];
          } else if (serviceSlug === 'commercial') {
            mockData.title = 'Commercial Plumbing Services';
            mockData.overview = 'Our commercial plumbing services are designed for businesses, office buildings, retail establishments, and multi-unit properties. We provide prompt, professional solutions to minimize disruption to your operations.';
            mockData.benefits = [
              {
                id: '1',
                title: 'Minimize Downtime',
                description: 'We work efficiently to reduce impact on your business operations.'
              },
              {
                id: '2',
                title: 'Code Compliance',
                description: 'All work meets or exceeds local commercial plumbing codes.'
              },
              {
                id: '3',
                title: 'Preventative Maintenance',
                description: 'Regular maintenance plans to avoid costly emergency repairs.'
              },
              {
                id: '4',
                title: 'Scalable Solutions',
                description: 'Services that can grow with your business needs.'
              }
            ];
            mockData.commonProblems = [
              {
                id: '1',
                title: 'Sewer Line Backups',
                description: 'Can disrupt business operations and create unsanitary conditions.',
                solution: 'Our commercial-grade equipment quickly clears blockages and restores proper function.'
              },
              {
                id: '2',
                title: 'Insufficient Water Pressure',
                description: 'Impacts bathroom facilities, kitchen operations, and other business functions.',
                solution: 'We diagnose pressure issues and implement effective solutions to restore proper flow.'
              },
              {
                id: '3',
                title: 'Plumbing Code Violations',
                description: 'Non-compliant systems can lead to fines and business interruptions.',
                solution: 'Our team brings your plumbing up to code with professional installations and retrofits.'
              }
            ];
          } else if (serviceSlug === 'emergency') {
            mockData.title = 'Emergency Plumbing Services';
            mockData.overview = 'Our 24/7 emergency plumbing services provide immediate response to urgent plumbing issues. From burst pipes to severe leaks and flooding, our team is ready to minimize damage to your property.';
            mockData.benefits = [
              {
                id: '1',
                title: '24/7 Availability',
                description: 'Were available around the clock, including weekends and holidays.'
              },
              {
                id: '2',
                title: 'Rapid Response',
                description: 'Our technicians arrive quickly to address your emergency.'
              },
              {
                id: '3',
                title: 'Fully Equipped Vehicles',
                description: 'Our service vehicles carry tools and parts to solve most emergencies on the first visit.'
              },
              {
                id: '4',
                title: 'Damage Mitigation',
                description: 'We focus on stopping water damage quickly to protect your property.'
              }
            ];
            mockData.commonProblems = [
              {
                id: '1',
                title: 'Burst Pipes',
                description: 'Causing flooding and potential severe water damage to your property.',
                solution: 'We quickly shut off water supply, repair or replace damaged pipes, and advise on water damage remediation.'
              },
              {
                id: '2',
                title: 'Severe Clogs and Backups',
                description: 'Resulting in overflow from toilets, sinks, or drains that can damage flooring and walls.',
                solution: 'Our powerful equipment resolves even the toughest clogs to restore proper drainage.'
              },
              {
                id: '3',
                title: 'Water Heater Failures',
                description: 'Leaking tanks or complete failure causing water damage or lack of hot water.',
                solution: 'We provide emergency repairs or same-day replacement options when needed.'
              },
              {
                id: '4',
                title: 'Gas Line Issues',
                description: 'Suspected gas leaks require immediate professional attention.',
                solution: 'Our licensed technicians can detect, locate, and repair gas line problems safely.'
              }
            ];
          } else if (serviceSlug === 'drain') {
            mockData.title = 'Drain Cleaning Services';
            mockData.overview = 'Our professional drain cleaning services restore proper flow to your plumbing system. We use state-of-the-art equipment to clear clogs and buildup from pipes of all sizes.';
            mockData.process = [
              {
                id: '1',
                stepNumber: 1,
                title: 'Drain Inspection',
                description: 'We use specialized cameras to identify the location and cause of the clog.'
              },
              {
                id: '2',
                stepNumber: 2,
                title: 'Method Selection',
                description: 'We choose the appropriate technique based on the type and severity of the blockage.'
              },
              {
                id: '3',
                stepNumber: 3,
                title: 'Clog Removal',
                description: 'Using snakes, hydro-jetting, or other methods to completely clear the obstruction.'
              },
              {
                id: '4',
                stepNumber: 4,
                title: 'Flow Testing',
                description: 'We verify that water flows freely through the cleared drain.'
              },
              {
                id: '5',
                stepNumber: 5,
                title: 'Preventative Recommendations',
                description: 'We provide advice on preventing future clogs based on the specific cause.'
              }
            ];
          } else if (serviceSlug === 'water-treatment') {
            mockData.title = 'Water Treatment Services';
            mockData.overview = 'Our water treatment solutions improve the quality, taste, and safety of your water. From whole-house filtration to water softening systems, we help ensure your water is clean and healthy.';
            mockData.benefits = [
              {
                id: '1',
                title: 'Healthier Water',
                description: 'Remove contaminants, chemicals, and impurities from your water supply.'
              },
              {
                id: '2',
                title: 'Better Taste',
                description: 'Eliminate unpleasant odors and improve the flavor of your drinking water.'
              },
              {
                id: '3',
                title: 'Protect Plumbing',
                description: 'Prevent scale buildup and extend the life of appliances and fixtures.'
              },
              {
                id: '4',
                title: 'Customized Solutions',
                description: 'We design water treatment systems based on your specific water quality issues.'
              }
            ];
            mockData.commonProblems = [
              {
                id: '1',
                title: 'Hard Water',
                description: 'Causing scale buildup on fixtures, reduced soap efficiency, and dry skin.',
                solution: 'Our water softening systems remove minerals that cause hardness.'
              },
              {
                id: '2',
                title: 'Contaminants',
                description: 'Bacteria, chemicals, or heavy metals affecting water safety and taste.',
                solution: 'We offer advanced filtration systems to remove specific contaminants.'
              },
              {
                id: '3',
                title: 'Iron and Sulfur',
                description: 'Creating stains, odors, and unpleasant taste in water.',
                solution: 'Specialized treatment systems target these specific minerals.'
              }
            ];
          }
          
          // Set the mock data
          setService(mockData);
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-red-600">Error</h2>
        <p className="mt-4">{error}</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">Service Not Found</h2>
        <p className="mt-4">The requested service information could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#152f59] to-[#25477e] text-white rounded-lg p-8 mb-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h1>
            <p className="text-lg">{service.overview}</p>
            <button className="mt-6 bg-[#7ac144] hover:bg-[#68a93a] text-white font-bold py-3 px-6 rounded-md transition duration-300">
              Request Service
            </button>
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
                <p className="text-gray-700">{benefit.description}</p>
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
                <p className="text-gray-700 mb-3">{problem.description}</p>
                {problem.solution && (
                  <div>
                    <span className="font-semibold text-[#7ac144]">Our Solution: </span>
                    <span className="text-gray-700">{problem.solution}</span>
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
                  <p className="text-gray-700">{step.description}</p>
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
          <button className="bg-[#7ac144] hover:bg-[#68a93a] text-white font-bold py-3 px-6 rounded-md transition duration-300">
            Call Now
          </button>
          <button className="bg-white hover:bg-gray-100 text-[#152f59] font-bold py-3 px-6 rounded-md transition duration-300">
            Request Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicePage;