"use client"

import type React from "react"

import { useMemo } from "react"
import DocumentHead from "./DocumentHead"
import { useSitewideSettings } from "../../hooks/useSitewideSettings"
import type { SitewideSettings } from "../../types/SitewideSettings"

interface ServiceAreaSEOProps {
  areaName: string
  metaDescription?: string
  heroImage?: string
}

const ServiceAreaSEO: React.FC<ServiceAreaSEOProps> = ({ areaName, metaDescription, heroImage }) => {
  const { settings } = useSitewideSettings() as { settings: SitewideSettings | null; loading: boolean }

  // Format the area name for display (capitalize each word)
  const formattedAreaName = areaName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")

  // Create a meta description if one doesn't exist
  const seoDescription =
    metaDescription ||
    `Professional plumbing services in ${formattedAreaName}. We offer 24/7 emergency service, drain cleaning, water heater installation, and more. Call us today!`

  // Create page title
  const pageTitle = `${settings?.company_name || "Grey-Bruce Plumbing"} | Plumbing Services in ${formattedAreaName}`

  // Create structured data
  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: settings?.company_name || "Grey-Bruce Plumbing",
      image: settings?.company_logo_url,
      telephone: settings?.phone_number,
      email: settings?.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: settings?.address1_line,
        addressLocality: settings?.address1_city,
        addressRegion: settings?.address1_province,
        postalCode: settings?.address1_postal_code,
        addressCountry: "CA",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: "44.5690",
        longitude: "-80.9406",
      },
      url: window.location.href,
      areaServed: formattedAreaName,
      serviceType: "Plumbing Services",
    }),
    [settings, formattedAreaName],
  )

  return (
    <DocumentHead
      title={pageTitle}
      description={seoDescription}
      ogImage={heroImage}
      ogType="website"
      structuredData={structuredData}
    />
  )
}

export default ServiceAreaSEO

