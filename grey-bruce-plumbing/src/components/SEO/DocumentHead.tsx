"use client"

import type React from "react"

import { useEffect } from "react"
import { useLocation } from "react-router-dom"

interface DocumentHeadProps {
  title?: string
  description?: string
  canonicalUrl?: string
  ogImage?: string
  ogType?: string
  structuredData?: Record<string, any>
  children?: React.ReactNode
}

/**
 * A React 19 compatible component for managing document head
 * Replaces react-helmet-async with direct DOM manipulation
 */
const DocumentHead: React.FC<DocumentHeadProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = "website",
  structuredData,
  children,
}) => {
  const location = useLocation()
  const currentUrl = window.location.origin + location.pathname

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = title
    }

    // Update meta description
    updateOrCreateMetaTag("description", description)

    // Update canonical URL
    updateOrCreateLinkTag("canonical", canonicalUrl || currentUrl)

    // Update Open Graph tags
    updateOrCreateMetaTag("og:title", title)
    updateOrCreateMetaTag("og:description", description)
    updateOrCreateMetaTag("og:url", canonicalUrl || currentUrl)
    updateOrCreateMetaTag("og:type", ogType)
    if (ogImage) {
      updateOrCreateMetaTag("og:image", ogImage)
    }

    // Add structured data if provided
    if (structuredData) {
      updateOrCreateStructuredData(structuredData)
    }

    // Cleanup function to remove tags when component unmounts
    return () => {
      // We don't remove standard tags like title and description
      // as they should be replaced by the next page
    }
  }, [title, description, canonicalUrl, ogImage, ogType, structuredData, currentUrl])

  return children || null
}

// Helper function to update or create meta tags
const updateOrCreateMetaTag = (name: string, content?: string) => {
  if (!content) return

  // Check if the tag is a property (og:) or name
  const isProperty = name.startsWith("og:")
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`

  let tag = document.querySelector(selector) as HTMLMetaElement

  if (tag) {
    tag.content = content
  } else {
    tag = document.createElement("meta")
    if (isProperty) {
      tag.setAttribute("property", name)
    } else {
      tag.setAttribute("name", name)
    }
    tag.content = content
    document.head.appendChild(tag)
  }
}

// Helper function to update or create link tags
const updateOrCreateLinkTag = (rel: string, href?: string) => {
  if (!href) return

  let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement

  if (link) {
    link.href = href
  } else {
    link = document.createElement("link")
    link.rel = rel
    link.href = href
    document.head.appendChild(link)
  }
}

// Helper function to update or create structured data script
const updateOrCreateStructuredData = (data: Record<string, any>) => {
  // Remove any existing structured data scripts
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]')
  existingScripts.forEach((script) => script.remove())

  // Create new script element
  const script = document.createElement("script")
  script.type = "application/ld+json"
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

export default DocumentHead

