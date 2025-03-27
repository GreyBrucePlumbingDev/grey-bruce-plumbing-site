"use client"

import type React from "react"

import { useMemo } from "react"
import DocumentHead from "./DocumentHead"
import { useSitewideSettings } from "../../hooks/useSitewideSettings"
import type { SitewideSettings } from "../../types/SitewideSettings"

interface BlogPostSEOProps {
  title: string
  excerpt: string
  featuredImage?: string
  categories?: string
  publishDate?: string
  author?: string
}

const BlogPostSEO: React.FC<BlogPostSEOProps> = ({
  title,
  excerpt,
  featuredImage,
  categories,
  publishDate,
  author = "Grey-Bruce Plumbing",
}) => {
  const { settings } = useSitewideSettings() as { settings: SitewideSettings | null; loading: boolean }

  // Create structured data for blog post
  const structuredData = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      image: featuredImage || "",
      datePublished: publishDate || new Date().toISOString(),
      dateModified: new Date().toISOString(),
      author: {
        "@type": "Organization",
        name: author,
      },
      publisher: {
        "@type": "Organization",
        name: settings?.company_name || "Grey-Bruce Plumbing",
        logo: {
          "@type": "ImageObject",
          url: settings?.company_logo_url || "",
        },
      },
      description: excerpt,
      keywords:
        categories
          ?.split(",")
          .map((cat) => cat.trim())
          .join(", ") || "plumbing, blog",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": window.location.href,
      },
    }),
    [title, excerpt, featuredImage, categories, publishDate, author, settings],
  )

  return (
    <DocumentHead
      title={`${title} | ${settings?.company_name || "Grey-Bruce Plumbing"}`}
      description={excerpt}
      ogImage={featuredImage}
      ogType="article"
      structuredData={structuredData}
    />
  )
}

export default BlogPostSEO

