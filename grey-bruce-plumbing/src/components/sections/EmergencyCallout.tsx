import React from 'react';
import { Link } from 'react-router-dom';
import { useSitewideSettings } from '../../hooks/useSitewideSettings';
import { SitewideSettings } from '../../types/SitewideSettings';

const EmergencyCallout: React.FC = () => {
  const { settings, loading } = useSitewideSettings() as { 
    settings: SitewideSettings | null; 
    loading: boolean 
  };

  // Parse business hours from the settings
  const parseBusinessHours = () => {
    if (!settings || !settings.business_hours || settings.business_hours.trim() === '') {
      return [];
    }

    const daysFullNames: Record<string, string> = {
      'monday': 'Monday',
      'tuesday': 'Tuesday',
      'wednesday': 'Wednesday',
      'thursday': 'Thursday',
      'friday': 'Friday',
      'saturday': 'Saturday',
      'sunday': 'Sunday'
    };

    // Split by comma to get each day's schedule
    const days = settings.business_hours.toLowerCase().split(',');
    
    return days
      .filter(daySchedule => daySchedule && daySchedule.includes(':')) // Make sure item exists and has the right format
      .map(daySchedule => {
        // Split by colon to separate day from hours
        const [day, hours] = daySchedule.split(':');
        
        // Ensure day exists and is valid
        if (!day || !hours) {
          return { day: 'Unknown', hours: 'Invalid Format' };
        }
        
        const dayName = daysFullNames[day.trim()] || 'Unknown';
        
        // Format the hours or return "Closed" if specified
        const formattedHours = hours.trim().toLowerCase() === 'closed' 
          ? 'Closed' 
          : hours.trim()
              .replace('am', ' AM')
              .replace('pm', ' PM')
              .replace('-', ' - ');
        
        return {
          day: dayName,
          hours: formattedHours
        };
      });
  };

  // Default hours to show while loading or if parsing fails
  const defaultHours = [
    { day: 'Monday', hours: 'Loading...' },
    { day: 'Tuesday', hours: 'Loading...' },
    { day: 'Wednesday', hours: 'Loading...' },
    { day: 'Thursday', hours: 'Loading...' },
    { day: 'Friday', hours: 'Loading...' },
    { day: 'Saturday', hours: 'Loading...' },
    { day: 'Sunday', hours: 'Loading...' },
  ];

  // Get operating hours or use fallback
  let operatingHours;
  
  try {
    const parsedHours = !loading && settings?.business_hours 
      ? parseBusinessHours()
      : [];
    
    // If parsing successful and we have hours for all days, use them
    // Otherwise fall back to defaults
    operatingHours = parsedHours.length === 7 ? parsedHours : defaultHours;
  } catch (error) {
    console.error("Error parsing business hours:", error);
    operatingHours = defaultHours;
  }

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
              {loading || !settings?.emergency_phone ? '(555) 123-4567' : settings.emergency_phone}
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
            to={settings?.booking_link || "#"} 
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