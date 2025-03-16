import React from 'react';
import { Link } from 'react-router-dom';

const ContactUs: React.FC = () => {
  return (
    <div id="contact" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Main Callout Section */}
        <div className="bg-[#152f59] text-white rounded-lg shadow-xl overflow-hidden mb-12">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left side - Text */}
            <div className="md:w-2/3 p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Owen Sound's Trusted Experts - Reach Out Now For Solutions!
              </h2>
            </div>
            
            {/* Right side - Button */}
            <div className="md:w-1/3 p-8 md:p-12 flex justify-center">
              <Link 
                to="/booking" 
                className="px-8 py-4 bg-[#7ac144] hover:bg-[#69a83a] text-white font-bold text-xl rounded-lg transition-colors duration-300 shadow-md whitespace-nowrap"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>
        
        {/* Contact Info Preview */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {/* Phone */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#152f59] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#152f59] mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">Available 24/7 for emergency service</p>
            <a href="tel:5551234567" className="text-xl font-bold text-[#7ac144] hover:underline">
              (555) 123-4567
            </a>
          </div>
          
          {/* Email */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#152f59] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#152f59] mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">We'll respond within 24 hours</p>
            <a href="mailto:info@plumberexperts.com" className="text-lg font-bold text-[#7ac144] hover:underline">
              info@plumberexperts.com
            </a>
          </div>
          
          {/* Office */}
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#152f59] rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#152f59] mb-2">Visit Us</h3>
            <p className="text-gray-600 mb-4">Monday - Friday: 8AM - 5PM</p>
            <address className="not-italic text-lg text-[#7ac144]">
              123 Main Street<br />
              Owen Sound, ON
            </address>
          </div>
        </div>
        
        {/* Quick Form Preview */}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-[#152f59] mb-6 text-center">
            Send Us a Quick Message
          </h3>
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Need an estimate or have a question? We'll get back to you ASAP.
            </p>
            <Link 
              to="/contact" 
              className="px-6 py-3 bg-[#152f59] hover:bg-[#0e1f3a] text-white font-medium rounded-lg transition-colors duration-300"
            >
              Go to Contact Form
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ContactUs;