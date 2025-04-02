"use client"

import type React from "react"
import { useState, useEffect, useRef, type TouchEvent } from "react"
import { FaHome, FaBuilding, FaExclamationTriangle, FaWater, FaTint, FaShieldAlt, FaHeadset } from "react-icons/fa"
import { FaArrowUpFromWaterPump } from "react-icons/fa6"
import { Link } from "react-router-dom"
import { supabase } from "../../lib/supabase"

interface ServiceCardProps {
  title: string
  description: string
  icon: React.ReactNode
  url: string
  isActive: boolean
}

interface ServiceData {
  id: string
  slug: string
  title: string
  overview: string
  imageUrl: string
  benefits: any
  commonProblems: any
  process: any
  relatedServices: any
  created_at: string
  updated_at: string
  summary: string
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, url, isActive }) => {
  return (
    <Link to={url} className="block">
      <div
        className={`
          relative flex flex-col bg-white rounded-lg p-6 transition-all duration-300
          min-w-[280px] max-w-[280px] 
          ${
            isActive
              ? "border-2 border-primary-500 shadow-lg translate-y-0 scale-110 z-10 min-h-[220px]"
              : "border border-gray-200 min-h-[200px] opacity-80"
          }
        `}
      >
        <div className="text-secondary-700 text-2xl mb-2">{icon}</div>
        <h3 className={`text-secondary-700 font-bold mb-2 ${isActive ? "text-xl" : "text-lg truncate"}`} title={title}>
          {title}
        </h3>
        <p className={`text-gray-600 ${isActive ? "text-sm" : "text-xs line-clamp-3"} overflow-hidden`}>
          {description}
        </p>
      </div>
    </Link>
  )
}

const getIconForSlug = (slug: string): React.ReactNode => {
  switch (slug) {
    case "residential":
      return <FaHome />
    case "commercial":
      return <FaBuilding />
    case "emergency":
      return <FaExclamationTriangle />
    case "drain":
      return <FaWater />
    case "water-treatment":
      return <FaTint />
    case "well-pump":
      return <FaArrowUpFromWaterPump />
    case "backflow":
      return <FaShieldAlt />
    case "consultation":
      return <FaHeadset />
    default:
      return <FaHome />
  }
}

const PopularServices: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right" | "">("")
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [services, setServices] = useState<
    Array<{
      id: string
      title: string
      description: string
      icon: React.ReactNode
      url: string
    }>
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Minimum swipe distance threshold (in px)
  const minSwipeDistance = 50

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase.from("services").select("*")

        if (error) {
          throw error
        }

        if (data) {
          const formattedServices = data.map((service: ServiceData) => ({
            id: service.id,
            title: service.title,
            description: service.summary ? service.summary : service.overview.substring(0, 150),
            icon: getIconForSlug(service.slug),
            url: `/services/${service.slug}`,
          }))
          setServices(formattedServices)
          console.log("Services:", formattedServices)
        }
      } catch (err) {
        console.error("Error fetching services:", err)
        setError("Failed to load services. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchServices()

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on initial render
    checkIsMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile)

    // Clean up
    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  const moveLeft = () => {
    setDirection("left")
    setActiveIndex((prevIndex) => (prevIndex === 0 ? services.length - 1 : prevIndex - 1))
  }

  const moveRight = () => {
    setDirection("right")
    setActiveIndex((prevIndex) => (prevIndex + 1) % services.length)
  }

  // Touch event handlers
  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      moveRight()
    } else if (isRightSwipe) {
      moveLeft()
    }
  }

  const getVisibleCards = () => {
    if (loading) {
      return (
        <div className="w-full flex justify-center items-center h-[200px]">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )
    }

    if (error || services.length === 0) {
      return (
        <div className="w-full flex justify-center items-center h-[200px]">
          <div className="alert alert-error">
            <span>{error || "No services available"}</span>
          </div>
        </div>
      )
    }

    const visibleCount = isMobile ? 1 : 3
    const halfVisible = isMobile ? 0 : 0.5

    // Calculate which indices to show
    const indices: number[] = []
    const totalVisible = Math.floor(visibleCount + halfVisible * 2)
    const halfTotal = Math.floor(totalVisible / 2)

    for (let i = -halfTotal; i <= halfTotal; i++) {
      const index = (activeIndex + i + services.length) % services.length
      indices.push(index)
    }

    return indices.map((index) => {
      // Extract the service for cleaner code
      const service = services[index]
      const isActive = index === activeIndex

      return (
        <div
          key={`visible-${index}`}
          className={`
          transition-all duration-500 px-2
          ${isMobile ? "w-full flex justify-center" : Math.abs(indices.indexOf(index) - halfTotal) <= 0.5 ? "w-full" : "w-1/4"}
          ${isActive ? "my-4" : "my-8"} 
        `}
        >
          <ServiceCard
            title={service.title}
            description={service.description}
            icon={service.icon}
            url={service.url}
            isActive={isActive}
          />
        </div>
      )
    })
  }

  return (
    <div id="services" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[#152f59] mb-12">Services We Offer</h2>

        <div className="relative px-8 md:px-12 mx-auto max-w-6xl">
          {/* Left Arrow Button */}
          <button
            onClick={moveLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-3 text-[#152f59] hover:bg-[#7ac144] hover:text-white transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div
            className="overflow-hidden pb-8 pt-8"
            ref={carouselRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className={`
      flex transition-transform duration-500 ease-in-out items-center
      ${isMobile ? "justify-center" : ""}
      ${direction === "left" ? "animate-slide-left" : direction === "right" ? "animate-slide-right" : ""}
    `}
            >
              {getVisibleCards()}
            </div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={moveRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-3 text-[#152f59] hover:bg-[#7ac144] hover:text-white transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-8">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? "right" : "left")
                setActiveIndex(index)
              }}
              className={`
                mx-1 h-3 w-3 rounded-full transition-all duration-300
                ${index === activeIndex ? "bg-[#7ac144] w-6" : "bg-[#152f59] bg-opacity-30"}
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Button to Access Services Page */}
        <div className="flex justify-center mt-12">
          <Link
            to="/services"
            className="btn bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            View All Services
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PopularServices

