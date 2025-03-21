import React, { useState } from 'react';
import { useTestimonials } from '../../hooks/useTestimonials';

const Testimonials: React.FC = () => {
  const { testimonials, loading, error } = useTestimonials();
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    if (!testimonials || testimonials.length === 0) return;
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % testimonials.length
    );
  };

  const prevTestimonial = () => {
    if (!testimonials || testimonials.length === 0) return;
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  // Generate star rating
  const renderStars = (rating: number) => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill={i <= rating ? "#FFD700" : "#E5E7EB"} 
          className="w-5 h-5 inline-block"
        >
          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </svg>
      );
    }
    
    return stars;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="py-25 bg-white">
        <div className="container mx-auto px-4 flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7ac144]"></div>
        </div>
      </div>
    );
  }

  // Show error state or empty state
  if (error || !testimonials || testimonials.length === 0) {
    return (
      <div className="py-25 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#152f59] mb-6">
            Why Customers Love Working With Us
          </h2>
          <p className="text-center text-gray-600">
            {error ? "Couldn't load testimonials. Please try again later." : "No testimonials available at the moment."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="reviews" className="py-25 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#152f59] mb-12">
          Why Customers Love Working With Us
        </h2>
        
        <div className="max-w-3xl mx-auto relative">
          {/* Left arrow */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md p-3 text-[#152f59] hover:bg-[#7ac144] hover:text-white transition-colors duration-300 z-10"
            aria-label="Previous testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Testimonial content */}
          <div className="bg-gray-50 rounded-lg shadow-lg p-8 md:p-10 transition-all duration-500 text-center">
            <div className="relative">
              {/* Quotation mark */}
              <div className="absolute top-0 left-0 -ml-4 -mt-4 text-[#7ac144] text-opacity-20 text-6xl leading-none">
                &ldquo;
              </div>
              
              {/* Testimonial text */}
              <p className="text-gray-700 text-lg mb-6 italic relative z-10">
                {testimonials[currentIndex].description}
              </p>
              
              {/* Customer name */}
              <h3 className="text-[#152f59] font-bold text-xl mb-2">
                {testimonials[currentIndex].name}
              </h3>
              
              {/* Rating */}
              <div className="flex justify-center mb-2">
                {renderStars(testimonials[currentIndex].rating)}
              </div>
              
              {/* Pagination indicator */}
              <div className="flex justify-center mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`mx-1 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-[#7ac144] w-6' 
                        : 'bg-[#152f59] bg-opacity-20 w-2'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Right arrow */}
          <button 
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md p-3 text-[#152f59] hover:bg-[#7ac144] hover:text-white transition-colors duration-300 z-10"
            aria-label="Next testimonial"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;