import type React from "react"
import { Link } from "react-router-dom"

interface ServiceCardProps {
  id: string
  title: string
  description: string
  slug: string
  icon: React.ReactNode
  category?: string
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, slug, icon, category }) => {
  return (
    <Link
      to={`/services/${slug}`}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full group border border-gray-100"
    >
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex items-start mb-4">
          <div className="mr-4">{icon}</div>
          <h2 className="text-xl font-bold text-secondary-700 group-hover:text-primary-500 transition-colors">
            {title}
          </h2>
        </div>

        <p className="text-gray-700 mb-4 flex-grow">{description}</p>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <span className="text-primary-500 font-medium flex items-center group-hover:translate-x-1 transition-transform">
            Learn More
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          {category && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
              {category === "residential"
                ? "Residential"
                : category === "commercial"
                  ? "Commercial"
                  : category === "emergency"
                    ? "Emergency"
                    : "Specialized"}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ServiceCard

