import React, { useState } from 'react';

interface TestimonialProps {
  text: string;
  name: string;
  rating: number;
}

const Testimonials: React.FC = () => {
  // Hardcoded testimonials (in the future, these will come from Supabase)
  const testimonialsList: TestimonialProps[] = [
    {
      text: "The team was professional, prompt, and extremely knowledgeable. They fixed our water heater issue quickly and even took the time to explain what went wrong and how to prevent it in the future. Highly recommend their services!",
      name: "Sarah Johnson",
      rating: 5
    },
    {
      text: "I had a plumbing emergency late at night and they responded within 30 minutes. The technician was courteous and resolved our issue without charging extra for the after-hours service. Great company with exceptional customer service.",
      name: "Michael Rodriguez",
      rating: 5
    },
    {
      text: "I've used their services for both my home and business. Always reliable, always fair pricing. They installed a new water treatment system for us and the difference in water quality is remarkable. Thank you!",
      name: "Jennifer Williams",
      rating: 4
    },
    {
      text: "When our backflow prevention device failed inspection, they came out the next day to replace it. The work was done correctly the first time and they even helped us with the paperwork for regulatory compliance. Very impressed!",
      name: "Robert Chen",
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % testimonialsList.length
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonialsList.length - 1 : prevIndex - 1
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

  return (
    <div id="reviews" className="py-16 bg-white">
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
                {testimonialsList[currentIndex].text}
              </p>
              
              {/* Customer name */}
              <h3 className="text-[#152f59] font-bold text-xl mb-2">
                {testimonialsList[currentIndex].name}
              </h3>
              
              {/* Rating */}
              <div className="flex justify-center mb-2">
                {renderStars(testimonialsList[currentIndex].rating)}
              </div>
              
              {/* Pagination indicator */}
              <div className="flex justify-center mt-6">
                {testimonialsList.map((_, index) => (
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