import React, { useState, useEffect, useRef, TouchEvent } from 'react';
import { FaHome, FaBuilding, FaExclamationTriangle, FaWater, FaTint, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import { FaArrowUpFromWaterPump } from "react-icons/fa6";
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string;
  isActive: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, url, isActive }) => {
  return (
    <Link to={url} className="block">
      <div 
        className={`
          relative flex flex-col bg-white rounded-lg p-6 transition-all duration-300
          min-w-[280px] max-w-[280px] h-[200px]
          ${isActive 
            ? 'border-2 border-[#7ac144] shadow-lg translate-y-2' 
            : 'border border-gray-200'
          }
        `}
      >
        <div className="text-[#152f59] text-2xl mb-2">
          {icon}
        </div>
        <h3 className="text-[#152f59] font-bold text-lg mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </Link>
  );
};

const PopularServices: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | ''>('');
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance threshold (in px)
  const minSwipeDistance = 50;

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Check on initial render
    checkIsMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIsMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const services = [
    {
      title: "Residential Services",
      description: "Complete plumbing solutions for your home",
      icon: <FaHome />,
      url: "/services/residential"
    },
    {
      title: "Commercial Services",
      description: "Professional plumbing for businesses",
      icon: <FaBuilding />,
      url: "/services/commercial"
    },
    {
      title: "Emergency Services",
      description: "24/7 urgent plumbing assistance",
      icon: <FaExclamationTriangle />,
      url: "/services/emergency"
    },
    {
      title: "Drain Services",
      description: "Clearing and maintenance for all drains",
      icon: <FaWater />,
      url: "/services/drain"
    },
    {
      title: "Water Treatment",
      description: "Clean, safe water solutions for your property",
      icon: <FaTint />,
      url: "/services/water-treatment"
    },
    {
      title: "Well Pump Services",
      description: "Installation and repair of well pump systems",
      icon: <FaArrowUpFromWaterPump />,
      url: "/services/well-pump"
    },
    {
      title: "Backflow Prevention",
      description: "Protect your water supply from contamination",
      icon: <FaShieldAlt />,
      url: "/services/backflow"
    },
    {
      title: "Support & Consultation",
      description: "Expert advice for all plumbing matters",
      icon: <FaHeadset />,
      url: "/services/consultation"
    }
  ];

  const moveLeft = () => {
    setDirection('left');
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? services.length - 1 : prevIndex - 1
    );
  };

  const moveRight = () => {
    setDirection('right');
    setActiveIndex((prevIndex) => 
      (prevIndex + 1) % services.length
    );
  };

  // Touch event handlers
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      moveRight();
    } else if (isRightSwipe) {
      moveLeft();
    }
  };

  const getVisibleCards = () => {
    const visibleCount = isMobile ? 1 : 3;
    const halfVisible = isMobile ? 0 : 0.5;
    
    // Calculate which indices to show
    let indices = [];
    const totalVisible = Math.floor(visibleCount + (halfVisible * 2));
    const halfTotal = Math.floor(totalVisible / 2);
    
    for (let i = -halfTotal; i <= halfTotal; i++) {
      let index = (activeIndex + i + services.length) % services.length;
      indices.push(index);
    }
    
    return indices.map((index) => (
      <div 
        key={index} 
        className={`
          transition-all duration-300 px-2
          ${isMobile ? 'w-full flex justify-center' : Math.abs(indices.indexOf(index) - halfTotal) <= 0.5 ? 'w-full' : 'w-1/4'}
        `}
      >
        <ServiceCard
          title={services[index].title}
          description={services[index].description}
          icon={services[index].icon}
          url={services[index].url}
          isActive={index === activeIndex}
        />
      </div>
    ));
  };

  return (
    <div id="services" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#152f59] mb-12">Services We Offer</h2>
        
        <div className="relative px-8 md:px-12 mx-auto max-w-6xl">
          {/* Left Arrow Button */}
          <button 
            onClick={moveLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-3 text-[#152f59] hover:bg-[#7ac144] hover:text-white transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Cards Container */}
          <div 
            className="overflow-hidden pb-8"
            ref={carouselRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div 
              className={`
                flex transition-transform duration-300 ease-in-out
                ${isMobile ? 'justify-center' : ''}
                ${direction === 'left' ? 'animate-slide-left' : direction === 'right' ? 'animate-slide-right' : ''}
              `}
            >
              {getVisibleCards()}
            </div>
          </div>
          
          {/* Right Arrow Button */}
          <button 
            onClick={moveRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-3 text-[#152f59] hover:bg-[#7ac144] hover:text-white transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Dots Navigation */}
        <div className="flex justify-center mt-8">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? 'right' : 'left');
                setActiveIndex(index);
              }}
              className={`
                mx-1 h-3 w-3 rounded-full transition-all duration-300
                ${index === activeIndex ? 'bg-[#7ac144] w-6' : 'bg-[#152f59] bg-opacity-30'}
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularServices;