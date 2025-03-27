"use client"

import type React from "react"

import { useMemo } from "react"
import DocumentHead from "./DocumentHead"
import { useSitewideSettings } from "../../hooks/useSitewideSettings"
import type { SitewideSettings } from "../../types/SitewideSettings"

const HomeSEO: React.FC = () => {
  const { settings } = useSitewideSettings() as { settings: SitewideSettings | null; loading: boolean }

  // Default description if settings aren't loaded
  const defaultDescription =
    "Professional plumbing services for residential and commercial properties. 24/7 emergency service, licensed plumbers, and transparent pricing."

  // Create structured data
  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: settings?.company_name || "Grey-Bruce Plumbing",
      url: window.location.origin,
      logo: settings?.company_logo_url,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: settings?.phone_number,
        contactType: "customer service",
        areaServed: "Grey-Bruce County",
        availableLanguage: "English",
      },
      sameAs: [settings?.facebook_url, settings?.twitter_url, settings?.instagram_url, settings?.linkedin_url].filter(
        Boolean,
      ),
    }),
    [settings],
  )

  return (
    <DocumentHead
      title={settings?.company_name || "Grey-Bruce Plumbing | Professional Plumbing Services"}
      description={settings?.footer_text || defaultDescription}
      ogImage={settings?.company_logo_url}
      structuredData={structuredData}
    />
  )
}

export default HomeSEO

