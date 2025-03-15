// src/components/PopularServices.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ServiceProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
}

const PopularServices = () => {
  const services: ServiceProps[] = [
    {
      id: 'residential',
      title: 'Residential Services',
      description: 'Complete plumbing solutions for your home, from repairs to renovations.',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      link: '/services/residential'
    },
    {
      id: 'commercial',
      title: 'Commercial Services',
      description: 'Reliable plumbing services for businesses with minimal disruption.',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      link: '/services/commercial'
    },
    {
      id: 'emergency',
      title: 'Emergency Services',
      description: '24/7 rapid response for all your plumbing emergencies.',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      link: '/services/emergency'
    },
    {
      id: 'drain',
      title: 'Drain Services',
      description: 'Professional drain cleaning, repair and maintenance services.',
      icon: 'M19 11V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2h8m-8-5v5a2 2 0 002 2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 001.414 0L21 19.414A1 1 0 0021 18V9a2 2 0 00-2-2H5a2 2 0 00-2 2v5',
      link: '/services/drain'
    },
    {
      id: 'water',
      title: 'Water Treatment',
      description: 'Clean, safe water solutions for your home or business.',
      icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
      link: '/services/water-treatment'
    },
    {
      id: 'well',
      title: 'Well Pump Services',
      description: 'Installation, maintenance and repair for all well pump systems.',
      icon: 'M5 13l4 4L19 7',
      link: '/services/well-pump'
    },
    {
      id: 'backflow',
      title: 'Backflow Prevention',
      description: 'Protect your water supply with our backflow prevention services.',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      link: '/services/backflow'
    },
    {
      id: 'support',
      title: 'Support & Consultation',
      description: 'Expert plumbing advice and planning for your projects.',
      icon: 'M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z',
      link: '/services/consultation'
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Handles changing to next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === services.length - 3 ? 0 : prevIndex + 1
    );
  };

  // Handles changing to previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? services.length - 3 : prevIndex - 1
    );
  };

  // Go to specific slide when indicator dot is clicked
  const goToSlide = (index: number) => {
    if (index + 2 < services.length) {
      setCurrentIndex(index);
    } else {
      // Handle edge case for last slides
      setCurrentIndex(services.length - 3);
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Autoscroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Visible cards include current and surrounding ones
  const visibleServices = () => {
    const result = [];
    // Current visible cards (including partial ones)
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % services.length;
      result.push({
        ...services[index],
        position: i
      });
    }
    return result;
  };

  return (
    <div id="services" className="py-16 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#152f59]">
          Services We Offer
        </h2>
        
        <div 
          className="relative overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Carousel controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            aria-label="Previous service"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#152f59]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
            aria-label="Next service"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#152f59]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Service cards */}
          <div className="flex justify-center items-stretch gap-4 transition-all duration-500 ease-in-out py-4">
            {visibleServices().map((service) => {
              // Set position classes
              let positionClasses = "";
              
              if (service.position === 0) {
                // First card (partial)
                positionClasses = "opacity-70 translate-x-1/2 hidden md:block";
              } else if (service.position === 3) {
                // Last card (partial)
                positionClasses = "opacity-70 -translate-x-1/2 hidden md:block";
              } else {
                // Full cards
                positionClasses = "opacity-100 z-10";
                
                // Selected card
                if (service.position === 1) {
                  positionClasses += " transform -translate-y-2 border-2 border-[#7ac144] shadow-lg";
                }
              }
              
              return (
                <Link 
                  to={service.link}
                  key={service.id}
                  className={`card bg-base-100 shadow hover:shadow-md border transition-all duration-300 ease-in-out flex-shrink-0 ${positionClasses} ${service.position === 1 ? 'w-full md:w-1/3 lg:w-1/4' : 'w-full md:w-1/4 lg:w-1/5'}`}
                >
                  <div className="card-body">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-8 w-8 text-[#7ac144] mb-3" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                    </svg>
                    <h3 className="card-title text-lg font-bold text-[#152f59]">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                    <div className="card-actions justify-end mt-4">
                      <div className="text-[#7ac144] font-medium text-sm flex items-center">
                        Learn more
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          
          {/* Indicator dots */}
          <div className="flex justify-center mt-8 gap-2">
            {services.slice(0, services.length - 2).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-[#7ac144] w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopularServices;