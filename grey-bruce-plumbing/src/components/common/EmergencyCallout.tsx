import type React from "react"
import { FaExclamationTriangle } from "react-icons/fa"

interface EmergencyCalloutProps {
  phoneNumber?: string
  bookingLink?: string
}

const EmergencyCallout: React.FC<EmergencyCalloutProps> = ({ phoneNumber, bookingLink }) => {
  return (
    <div className="bg-gradient-to-r from-secondary-700 to-secondary-600 text-white rounded-lg overflow-hidden shadow-xl">
      <div className="p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-2/3 mb-6 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Emergency Plumbing Services?</h2>
            <p className="text-lg mb-6">
              We're available 24/7 for all your emergency plumbing needs. Our team of experts is just a call away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${phoneNumber || ""}`}
                className="btn bg-primary-500 hover:bg-primary-600 text-white border-none"
              >
                Call Now: {phoneNumber || "Emergency Line"}
              </a>
              <a
                href={bookingLink || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-white text-secondary-700 hover:bg-gray-100 border-none"
              >
                Book Online
              </a>
            </div>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-32 w-32 text-white opacity-20 absolute -top-4 -right-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <FaExclamationTriangle className="h-24 w-24 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmergencyCallout

