"use client"

import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { supabase } from "../lib/supabase"
import { useSitewideSettings } from "../hooks/useSitewideSettings"
import type { SitewideSettings } from "../types/SitewideSettings"
import Container from "./common/Container"
import ServiceAreaSEO from "./SEO/ServiceAreaSEO"

interface ServiceAreaData {
  name: string
  id: string
  address?: string
  is_main_address: boolean
  description?: string
  meta_description?: string
  hero_image?: string
}

const ServiceAreaLanding = () => {
  const { areaSlug } = useParams<{ areaSlug: string }>()
  const [serviceArea, setServiceArea] = useState<ServiceAreaData | null>(null)
  const [nearbyAreas, setNearbyAreas] = useState<ServiceAreaData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { settings } = useSitewideSettings() as { settings: SitewideSettings | null; loading: boolean }

  useEffect(() => {
    const fetchServiceAreaData = async () => {
      try {
        setLoading(true)

        // Fetch the specific service area
        const { data, error } = await supabase
          .from("service_areas")
          .select("*")
          .eq("name", areaSlug?.replace(/-/g, " ")
            .split(" ")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(" ")
          )
          .single()

        if (error) throw error

        setServiceArea(data)

        // Fetch nearby service areas (excluding the current one)
        const { data: nearbyData, error: nearbyError } = await supabase
          .from("service_areas")
          .select("*")
          .neq("name", data.name)
          .eq("is_main_address", false)
          .limit(4)

        if (nearbyError) throw nearbyError

        setNearbyAreas(nearbyData || [])
      } catch (err) {
        console.error("Error fetching service area data:", err)
        setError("Failed to load service area information")
      } finally {
        setLoading(false)
      }
    }

    if (areaSlug) {
      fetchServiceAreaData()
    }
  }, [areaSlug])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-[#7ac144]"></span>
      </div>
    )
  }

  if (error || !serviceArea) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <h2 className="text-xl font-bold text-red-700">Error</h2>
          <p className="text-red-600">{error || "Service area not found"}</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
            Return to homepage
          </Link>
        </div>
      </div>
    )
  }

  // Format the area name for display (capitalize each word)
  const formattedAreaName = serviceArea.name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")

  return (
    <>
      <ServiceAreaSEO
        areaName={serviceArea.name}
        metaDescription={serviceArea.meta_description}
        heroImage={serviceArea.hero_image}
      />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#152f59] to-[#25477e] text-white py-16">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Trusted Plumbing Services in {formattedAreaName}</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Professional plumbing solutions for residential and commercial properties with 24/7 emergency service.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href={settings?.booking_link || "#"}
                className="btn bg-[#7ac144] hover:bg-[#6aad39] text-white border-none"
              >
                Book Now
              </a>
              <a
                href={`tel:${settings?.emergency_phone}`}
                className="btn bg-white text-[#152f59] hover:bg-gray-100 border-none"
              >
                Call for Emergency: {settings?.emergency_phone}
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-[#152f59] mb-6">
                Plumbing Services We Offer in {formattedAreaName}
              </h2>

              {serviceArea.description ? (
                <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: serviceArea.description }} />
              ) : (
                <div className="prose max-w-none mb-8">
                  <p>
                    Welcome to {settings?.company_name || "Grey-Bruce Plumbing"}, your trusted plumbing partner in{" "}
                    {formattedAreaName}. We provide comprehensive plumbing services for both residential and commercial
                    properties, ensuring that your plumbing systems run smoothly and efficiently.
                  </p>
                  <p>
                    Our team of licensed and experienced plumbers is available 24/7 to handle any plumbing emergency.
                    From minor repairs to major installations, we have the expertise and equipment to get the job done
                    right the first time.
                  </p>
                  <h3>Our Services Include:</h3>
                  <ul>
                    <li>Emergency Plumbing Repairs</li>
                    <li>Drain Cleaning and Unclogging</li>
                    <li>Water Heater Installation and Repair</li>
                    <li>Pipe Repair and Replacement</li>
                    <li>Fixture Installation</li>
                    <li>Backflow Prevention</li>
                    <li>Water Treatment Systems</li>
                    <li>Commercial Plumbing Services</li>
                  </ul>
                </div>
              )}

              {/* Why Choose Us Section */}
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-2xl font-bold text-[#152f59] mb-4">
                  Why Choose Us for Your {formattedAreaName} Plumbing Needs?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="bg-[#7ac144] rounded-full p-2 mr-3 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Licensed & Insured</h4>
                      <p className="text-sm text-gray-600">Fully certified professionals you can trust</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-[#7ac144] rounded-full p-2 mr-3 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">24/7 Emergency Service</h4>
                      <p className="text-sm text-gray-600">Available whenever you need us</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-[#7ac144] rounded-full p-2 mr-3 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Transparent Pricing</h4>
                      <p className="text-sm text-gray-600">No hidden fees or surprise charges</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-[#7ac144] rounded-full p-2 mr-3 text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold">Satisfaction Guaranteed</h4>
                      <p className="text-sm text-gray-600">We're not happy until you're happy</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-[#152f59] text-white p-6 rounded-lg text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Solve Your Plumbing Problems?</h3>
                <p className="mb-6">Contact us today for fast, reliable plumbing services in {formattedAreaName}.</p>
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

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              {/* Contact Information */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-[#152f59] mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#7ac144] mt-1 mr-3"
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
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p>{settings?.phone_number}</p>
                      <p className="text-sm">Emergency: {settings?.emergency_phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#7ac144] mt-1 mr-3"
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
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p>{settings?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#7ac144] mt-1 mr-3"
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
                    <div>
                      <h4 className="font-semibold">Business Hours</h4>
                      <p className="text-sm">{settings?.business_hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-[#152f59] mb-4">We Also Serve</h3>
                <ul className="space-y-2">
                  {nearbyAreas.map((area) => (
                    <li key={area.id}>
                      <Link
                        to={`/service-area/${area.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className="flex items-center text-[#152f59] hover:text-[#7ac144] transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {area.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testimonial */}

            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default ServiceAreaLanding

