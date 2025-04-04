import type React from "react"
import { useSitewideSettings } from "../../hooks/useSitewideSettings"
import type { SitewideSettings } from "../../types/SitewideSettings"

const ContactUs: React.FC = () => {
  const { settings, loading } = useSitewideSettings() as { settings: SitewideSettings | null; loading: boolean }

  if (loading) return <div>Loading...</div>

  return (
    <div id="contact" className="py-12 bg-gray-50">
      <div className="container mx-auto">
        {/* Main Callout Section */}
        <div className="bg-secondary-700 rounded-lg shadow-xl overflow-hidden mb-10">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left side - Text */}
            <div className="md:w-2/3 p-6 md:p-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-white">
                Owen Sound's Trusted Experts - Reach Out Now For Solutions!
              </h2>
            </div>

            {/* Right side - Button */}
            <div className="md:w-1/3 p-6 md:p-10 flex justify-center">
              <a
                href={settings?.booking_link || "/contact"}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold text-lg rounded-lg transition-colors duration-300 shadow-md whitespace-nowrap"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>

        {/* Contact Info Preview */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
          {/* Phone */}
          <div className="bg-white rounded-lg shadow-md p-5 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-3 bg-secondary-700 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-secondary-700 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-3">Available 24/7 for emergency service</p>
            <a href={`tel:${settings?.emergency_phone}`} className="text-lg font-bold text-primary-500 hover:underline">
              {settings?.emergency_phone}
            </a>
          </div>

          {/* Email */}
          <div className="bg-white rounded-lg shadow-md p-5 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-3 bg-secondary-700 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-secondary-700 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-3">We'll respond within 24 hours</p>
            <a href={`mailto:${settings?.email}`} className="text-lg font-bold text-primary-500 hover:underline">
              {settings?.email}
            </a>
          </div>

          {/* Office */}
          <div className="bg-white rounded-lg shadow-md p-5 text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 mx-auto mb-3 bg-secondary-700 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-secondary-700 mb-2">Visit Us</h3>
            <div className="text-gray-600 mb-3">
              {settings?.business_hours && (
                <div className="grid grid-cols-1 gap-1 text-sm">
                  {settings.business_hours.split(",").map((day) => {
                    if (!day) return null
                    const [dayName, hours] = day.split(":")
                    return (
                      <div key={dayName} className="flex justify-between px-2">
                        <span className="capitalize font-medium">{dayName}</span>
                        <span>{hours}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <address className="not-italic text-base text-primary-500">
              {settings?.address1_line}
              <br />
              {settings?.address1_city}, {settings?.address1_province}
            </address>
          </div>
        </div>
      
        
      </div>
    </div>
  )
}

export default ContactUs

