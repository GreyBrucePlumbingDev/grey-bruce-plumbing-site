"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

const DomainRedirector = () => {
  const navigate = useNavigate()
  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    const checkDomain = async () => {
      // Get the current hostname
      const hostname = window.location.hostname

      // Skip redirect for localhost or the main domain
      if (hostname === "localhost" || hostname.includes("vercel.app") || redirected) {
        return
      }

      try {
        // First, check if we have a direct domain mapping in our database
        const { data: domainData, error: domainError } = await supabase
          .from("domain_mappings")
          .select("*")
          .eq("domain", hostname)
          .single()

        if (!domainError && domainData) {
          // We have a direct mapping, redirect to the specified path
          setRedirected(true)
          navigate(domainData.redirectTo)
          return
        }

        // If no direct mapping, check if it's a service area domain
        // Extract potential service area name from domain (e.g., collingwoodplumbing.com -> collingwood)
        const potentialAreaName = hostname
          .replace(/plumbing|plumber|\.com|\.ca|www\./gi, "")
          .replace(/\./g, "")
          .trim()

        if (potentialAreaName) {
          // Look for a matching service area
          const { data: areaData, error: areaError } = await supabase
            .from("service_areas")
            .select("*")
            .ilike("name", `%${potentialAreaName}%`)
            .limit(1)

          if (!areaError && areaData && areaData.length > 0) {
            // Found a matching service area, redirect to its page
            const areaSlug = areaData[0].name.toLowerCase().replace(/\s+/g, "-")
            setRedirected(true)
            navigate(`/service-area/${areaSlug}`)
            return
          }
        }

        // If no matches found, just continue to the homepage
      } catch (error) {
        console.error("Error in domain redirection:", error)
      }
    }

    checkDomain()
  }, [navigate, redirected])

  // This component doesn't render anything visible
  return null
}

export default DomainRedirector

