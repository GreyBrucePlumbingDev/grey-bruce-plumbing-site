import React from 'react';
import { Link } from 'react-router-dom';

const EmergencyCallout: React.FC = () => {
  // Hours of operation
  const operatingHours = [
    { day: 'Monday', hours: '7:00 AM - 8:00 PM' },
    { day: 'Tuesday', hours: '7:00 AM - 8:00 PM' },
    { day: 'Wednesday', hours: '7:00 AM - 8:00 PM' },
    { day: 'Thursday', hours: '7:00 AM - 8:00 PM' },
    { day: 'Friday', hours: '7:00 AM - 8:00 PM' },
    { day: 'Saturday', hours: '8:00 AM - 5:00 PM' },
    { day: 'Sunday', hours: '8:00 AM - 5:00 PM' },
  ];

  return (
    <div className="py-16 bg-[#152f59] text-white">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Title */}
        <h2 className="text-4xl font-bold text-center mb-8">
          Need Plumbing Help ASAP?
        </h2>
        
        {/* Call us text section */}
        <div className="text-center mb-8">
          <p className="text-lg mb-4">
            Call us today at{' '}
            <span className="text-3xl font-bold text-[#7ac144]">
              (555) 123-4567
            </span>{' '}
            and follow the prompts.
          </p>
          <p className="text-lg">
            Our team will take care of your call anytime, 24/7.
            Below are the hours of operation.
          </p>
        </div>
        
        {/* Hours of operation */}
        <div className="bg-white text-[#152f59] rounded-lg p-6 mb-8 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-center">Hours of Operation</h3>
          <div className="space-y-2">
            {operatingHours.map((item) => (
              <div key={item.day} className="flex justify-between items-center border-b border-gray-200 py-2">
                <span className="font-medium">{item.day}</span>
                <span>{item.hours}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Book now button */}
        <div className="flex justify-center">
          <Link 
            to="/booking" 
            className="px-8 py-4 bg-[#7ac144] hover:bg-[#69a83a] text-white font-bold text-lg rounded-lg transition-colors duration-300 shadow-md"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCallout;