"use client"

import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useSitewideSettings } from "../hooks/useSitewideSettings"
import type { SitewideSettings } from "../types/SitewideSettings"
import DocumentHead from "../components/DocumentHead"
import Container from "../components/common/Container"
import { FaHome, FaBuilding, FaExclamationTriangle, FaWater, FaTint, FaShieldAlt, FaHeadset } from "react-icons/fa"
import { FaArrowUpFromWaterPump } from "react-icons/fa6"

// Service type definition
interface Service {
  id: string
  slug: string
  title: string
  summary: string
  overview: string
  imageUrl?: string
  category?: string
}

// Service category type
type ServiceCategory = "all" | "residential" | "commercial" | "emergency" | "specialized"

const ServicesPage = () => {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { settings } = useSitewideSettings() as { settings: SitewideSettings | null; loading: boolean }

  // Function to get icon based on service slug
  const getIconForService = (slug: string) => {
    switch (slug) {
      case "residential":
        return <FaHome className="h-8 w-8 text-primary-500" />
      case "commercial":
        return <FaBuilding className="h-8 w-8 text-primary-500" />
      case "emergency":
        return <FaExclamationTriangle className="h-8 w-8 text-primary-500" />
      case "drain":
        return <FaWater className="h-8 w-8 text-primary-500" />
      case "water-treatment":
        return <FaTint className="h-8 w-8 text-primary-500" />
      case "well-pump":
        return <FaArrowUpFromWaterPump className="h-8 w-8 text-primary-500" />
      case "backflow":
        return <FaShieldAlt className="h-8 w-8 text-primary-500" />
      case "consultation":
        return <FaHeadset className="h-8 w-8 text-primary-500" />
      default:
        return <FaWater className="h-8 w-8 text-primary-500" />
    }
  }

  // Function to determine service category
  const getServiceCategory = (service: Service): ServiceCategory => {
    const title = service.title.toLowerCase()
    const slug = service.slug.toLowerCase()

    if (title.includes("emergency") || slug.includes("emergency")) {
      return "emergency"
    } else if (title.includes("residential") || slug.includes("residential")) {
      return "residential"
    } else if (title.includes("commercial") || slug.includes("commercial")) {
      return "commercial"
    } else {
      return "specialized"
    }
  }

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase.from("services").select("*").order("title")

        if (error) throw error

        if (data) {
          // Add category to each service
          const servicesWithCategories = data.map((service: Service) => ({
            ...service,
            category: getServiceCategory(service),
          }))

          setServices(servicesWithCategories)
          setFilteredServices(servicesWithCategories)
        }
      } catch (err) {
        console.error("Error fetching services:", err)
        setError("Failed to load services. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [])

  // Filter services based on category and search query
  useEffect(() => {
    let result = [...services]

    // Apply category filter
    if (activeCategory !== "all") {
      result = result.filter((service) => service.category === activeCategory)
    }

    // Apply search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (service) =>
          service.title.toLowerCase().includes(query) ||
          service.summary.toLowerCase().includes(query) ||
          service.overview.toLowerCase().includes(query),
      )
    }

    setFilteredServices(result)
  }, [activeCategory, searchQuery, services])

  // Categories for the filter
  const categories = [
    { id: "all", name: "All Services" },
    { id: "residential", name: "Residential" },
    { id: "commercial", name: "Commercial" },
    { id: "emergency", name: "Emergency" },
    { id: "specialized", name: "Specialized" },
  ]

  // Count services in each category
  const categoryCounts = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      count:
        category.id === "all" ? services.length : services.filter((service) => service.category === category.id).length,
    }))
  }, [services, categories])

  return (
    <>
      <DocumentHead pageTitle="Our Services" />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-secondary-800 to-secondary-700 text-white">
        <Container>
          <div className="py-12 md:py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Plumbing Services</h1>
            <p className="text-xl max-w-3xl mx-auto opacity-90">
              Professional plumbing solutions for residential and commercial properties with 24/7 emergency service.
            </p>
          </div>
        </Container>
      </div>

      <Container>
        <div className="py-12">
          {/* Search and Filter Section */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search Input */}
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-bordered w-full pl-10 focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>

              {/* Book Now Button */}
              <a
                href={settings?.booking_link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-white"
              >
                Book Now
              </a>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categoryCounts.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as ServiceCategory)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? "bg-secondary-700 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                <p className="mt-4 text-gray-600">Loading services...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* No Results State */}
          {!isLoading && !error && filteredServices.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No services found</h3>
              <p className="text-gray-600 mb-4">No services match your current search or filter.</p>
              <button
                onClick={() => {
                  setActiveCategory("all")
                  setSearchQuery("")
                }}
                className="btn btn-primary text-white"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Services Grid */}
          {!isLoading && !error && filteredServices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Link
                  key={service.id}
                  to={`/services/${service.slug}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full group border border-gray-100"
                >
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-start mb-4">
                      <div className="mr-4">{getIconForService(service.slug)}</div>
                      <h2 className="text-xl font-bold text-secondary-700 group-hover:text-primary-500 transition-colors">
                        {service.title}
                      </h2>
                    </div>

                    <p className="text-gray-700 mb-4 flex-grow">
                      {service.summary || service.overview.substring(0, 150)}
                    </p>

                    <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                      <span className="text-primary-500 font-medium flex items-center group-hover:translate-x-1 transition-transform">
                        Learn More
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>

                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {service.category === "residential"
                          ? "Residential"
                          : service.category === "commercial"
                            ? "Commercial"
                            : service.category === "emergency"
                              ? "Emergency"
                              : "Specialized"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Emergency Services CTA */}
          <div className="mt-16 bg-gradient-to-r from-secondary-700 to-secondary-600 text-white rounded-lg overflow-hidden shadow-xl">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-2/3 mb-6 md:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Need Emergency Plumbing Services?</h2>
                  <p className="text-lg mb-6">
                    We're available 24/7 for all your emergency plumbing needs. Our team of experts is just a call away.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href={`tel:${settings?.emergency_phone || ""}`}
                      className="btn bg-primary-500 hover:bg-primary-600 text-white border-none"
                    >
                      Call Now: {settings?.emergency_phone || "Emergency Line"}
                    </a>
                    <a
                      href={settings?.booking_link || "#"}
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

          {/* Service Areas Section */}
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-700 mb-6 text-center">Service Areas</h2>
            <p className="text-center text-lg text-gray-700 max-w-3xl mx-auto mb-8">
              We provide professional plumbing services throughout the Grey-Bruce region, including Owen Sound,
              Collingwood, and surrounding areas.
            </p>
            <div className="flex justify-center">
              <Link
                to="/service-areas"
                className="btn btn-outline border-secondary-700 text-secondary-700 hover:bg-secondary-700 hover:text-white"
              >
                View All Service Areas
              </Link>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-700 mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto">
              <div className="join join-vertical w-full">
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="faq-accordion" defaultChecked />
                  <div className="collapse-title text-xl font-medium">What services do you offer?</div>
                  <div className="collapse-content">
                    <p>
                      We offer a comprehensive range of plumbing services including residential and commercial plumbing,
                      emergency repairs, drain cleaning, water heater installation and repair, pipe repair and
                      replacement, fixture installation, backflow prevention, water treatment systems, and more.
                    </p>
                  </div>
                </div>
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="faq-accordion" />
                  <div className="collapse-title text-xl font-medium">Do you offer emergency services?</div>
                  <div className="collapse-content">
                    <p>
                      Yes, we provide 24/7 emergency plumbing services. Our team is always ready to respond to urgent
                      plumbing issues like burst pipes, major leaks, or sewer backups. Just call our emergency line and
                      we'll dispatch a technician as quickly as possible.
                    </p>
                  </div>
                </div>
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="faq-accordion" />
                  <div className="collapse-title text-xl font-medium">What areas do you serve?</div>
                  <div className="collapse-content">
                    <p>
                      We serve the entire Grey-Bruce region, including Owen Sound, Collingwood, Meaford, Thornbury, Blue
                      Mountains, and surrounding areas. Check our Service Areas page for a complete list of locations we
                      cover.
                    </p>
                  </div>
                </div>
                <div className="collapse collapse-arrow join-item border border-base-300">
                  <input type="radio" name="faq-accordion" />
                  <div className="collapse-title text-xl font-medium">How do I schedule a service?</div>
                  <div className="collapse-content">
                    <p>
                      You can schedule a service by calling our office, using our online booking system, or filling out
                      the contact form on our website. We'll get back to you promptly to confirm your appointment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default ServicesPage

