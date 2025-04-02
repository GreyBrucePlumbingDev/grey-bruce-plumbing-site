"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useSitewideSettings } from "../hooks/useSitewideSettings"
import type { SitewideSettings } from "../types/SitewideSettings"
import Container from "./common/Container"
import DocumentHead from "./SEO/DocumentHead"

interface ServiceArea {
  name: string
  id: string
  address?: string
  is_main_address: boolean
}

const ServiceAreaIndex = () => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { settings } = useSitewideSettings() as { settings: SitewideSettings | null; loading: boolean }

  useEffect(() => {
    const fetchServiceAreas = async () => {
      try {
        setLoading(true)

        // Fetch all service areas that are not main addresses
        const { data, error } = await supabase
          .from("service_areas")
          .select("*")
          .eq("is_main_address", false)
          .order("name", { ascending: true })

        if (error) throw error

        setServiceAreas(data || [])
      } catch (err) {
        console.error("Error fetching service areas:", err)
        setError("Failed to load service areas")
      } finally {
        setLoading(false)
      }
    }

    fetchServiceAreas()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-[#7ac144]"></span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <h2 className="text-xl font-bold text-red-700">Error</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  // Group service areas by first letter for alphabetical display
  const groupedAreas: Record<string, ServiceArea[]> = {}
  serviceAreas.forEach((area) => {
    const firstLetter = area.name.charAt(0).toUpperCase()
    if (!groupedAreas[firstLetter]) {
      groupedAreas[firstLetter] = []
    }
    groupedAreas[firstLetter].push(area)
  })

  // Sort the keys alphabetically
  const sortedLetters = Object.keys(groupedAreas).sort()

  // Create structured data for service areas
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.company_name || "Grey-Bruce Plumbing",
    url: window.location.origin,
    logo: settings?.company_logo_url,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings?.phone_number,
      contactType: "customer service",
      areaServed: serviceAreas.map((area) => area.name).join(", "),
    },
    areaServed: serviceAreas.map((area) => ({
      "@type": "City",
      name: area.name,
    })),
  }

  return (
    <>
      <DocumentHead
        title={`${settings?.company_name || "Grey-Bruce Plumbing"} | Service Areas`}
        description={`${settings?.company_name || "Grey-Bruce Plumbing"} provides professional plumbing services across multiple locations. Find your area for dedicated plumbing solutions.`}
        structuredData={structuredData}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#152f59] to-[#25477e] text-white py-16">
        <Container>
          <div className="text-center ">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 !text-white">Our Service Areas</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8 !text-white">
              Professional plumbing services available in the following locations. Click on your area to learn more.
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container>
        <div className="py-12">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#152f59] mb-6">Find Plumbing Services in Your Area</h2>
            <p className="text-lg text-gray-700 mb-8">
              {settings?.company_name || "Grey-Bruce Plumbing"} is proud to serve multiple communities with professional
              plumbing services. Select your location below to learn more about our services in your area.
            </p>

            {/* Alphabetical Index */}
            <div className="flex flex-wrap gap-2 mb-8">
              {sortedLetters.map((letter) => (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="w-8 h-8 flex items-center justify-center bg-[#152f59] text-white rounded-full hover:bg-[#7ac144] transition-colors"
                >
                  {letter}
                </a>
              ))}
            </div>

            {/* Service Areas List */}
            <div className="space-y-8">
              {sortedLetters.map((letter) => (
                <div key={letter} id={`letter-${letter}`} className="scroll-mt-24">
                  <h3 className="text-2xl font-bold text-[#152f59] mb-4 border-b border-gray-200 pb-2">{letter}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedAreas[letter].map((area) => (
                      <Link
                        key={area.id}
                        to={`/service-area/${area.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-[#7ac144] transition-all flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-[#7ac144] mr-2"
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
                        <span className="font-medium">{area.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-[#152f59] text-white p-8 rounded-lg text-center">
            <h3 className="text-2xl font-bold mb-4">Don't See Your Area Listed?</h3>
            <p className="mb-6">We may still be able to help! Contact us to check if we service your location.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={settings?.booking_link || "#"}
                className="btn bg-[#7ac144] hover:bg-[#6aad39] text-white border-none"
              >
                Schedule Service
              </a>
              <a
                href={`tel:${settings?.phone_number}`}
                className="btn bg-white text-[#152f59] hover:bg-gray-100 border-none"
              >
                Call Us: {settings?.phone_number}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default ServiceAreaIndex

