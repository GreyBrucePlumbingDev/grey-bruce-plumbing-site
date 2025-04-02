// src/components/AboutUsPreview.tsx
import { useAboutUs } from "../../hooks/useAboutUs"
import { Link } from "react-router-dom"

const AboutUsPreview = () => {
  const { aboutUsContent, loading, error } = useAboutUs()

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Loading about us content...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error loading content: {error}</p>
      </div>
    )
  }

  const years = aboutUsContent?.years_in_business || "[x]"

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-20 text-secondary-700">Why choose Grey-Bruce Plumbing?</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left side: About text content */}
        <div className="md:w-1/2">
          {aboutUsContent?.content ? (
            <div
              className="text-gray-700 mb-4 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: aboutUsContent.content }}
            />
          ) : (
            <p className="text-gray-700 mb-4">
              For over {years} years, Grey-Bruce Plumbing has served Owen Sound and the Grey-Bruce region with reliable,
              transparent, and efficient plumbing solutions. As licensed Class 4 Well Technicians and Certified Backflow
              Specialists, we combine expertise with modern conveniences like:
            </p>
          )}

          {/* Show the following list only if no custom content is available */}
          {!aboutUsContent?.content && (
            <ul className="list-none space-y-2 mb-6">
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">✔</span>
                <span>Priority Emergency Service - Available 24/7</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">✔</span>
                <span>"On My Way" Text Alerts - No more waiting in the dark</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">✔</span>
                <span>Free Estimates - Upfront pricing, no surprises</span>
              </li>
            </ul>
          )}

          <Link
            to="/about"
            className="flex items-center text-primary-500 hover:text-secondary-700 transition-colors duration-300 group w-fit"
          >
            <span className="text-lg font-medium border-b-2 border-primary-500 group-hover:border-secondary-700 pb-1">
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

        {/* Right side: Image */}
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-lg p-4 h-full flex flex-col items-center justify-center">
            {aboutUsContent?.image_url ? (
              <img
                src={aboutUsContent.image_url || "/placeholder.svg"}
                alt="Grey-Bruce Plumbing Team"
                className="rounded-lg w-full h-auto object-cover"
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 font-semibold mb-2">Team Photo</p>
                <p className="text-gray-400">(Image will be added here)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutUsPreview

