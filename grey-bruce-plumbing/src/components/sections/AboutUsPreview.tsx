// src/components/AboutUsPreview.tsx
import { Link } from 'react-router-dom';

const AboutUsPreview = () => {
  return (
    <div id="about" className="py-16 bg-base-200">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#152f59]">
          Why choose Grey-Bruce Plumbing?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left side: About text content */}
          <div className="flex flex-col space-y-6">
            <p className="text-lg text-gray-700">
              For over [x] years, Grey-Bruce Plumbing has served Owen Sound and the Grey-Bruce region with reliable, transparent, and efficient plumbing solutions. As licensed Class 4 Well Technicians and Certified Backflow Specialists, we combine expertise with modern conveniences like: <br />
              ✔  Priority Emergency Service - Available 24/7<br />
              ✔  “On My Way” Text Alerts - No more waiting in the dark<br />
              ✔  Free Estimates - Upfront pricing, no surprises<br />
            </p>
            
            <Link 
              to="/about" 
              className="flex items-center text-[#7ac144] hover:text-[#6aad39] transition-colors duration-300 group w-fit"
            >
              <span className="text-lg font-medium border-b-2 border-[#7ac144] group-hover:border-[#6aad39] pb-1">
                Meet the Team
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
          
          {/* Right side: Image placeholder */}
          <div className="bg-gray-200 rounded-lg h-96 lg:h-[28rem] flex items-center justify-center shadow-md order-first md:order-last mb-8 md:mb-0">
            <div className="text-gray-400 flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-lg font-medium">Team Photo</p>
              <p className="text-sm">(Image will be added here)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPreview;