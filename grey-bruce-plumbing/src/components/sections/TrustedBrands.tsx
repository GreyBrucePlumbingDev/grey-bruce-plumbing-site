"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useTrustedBrands } from "../../hooks/useTrustedBrands"

const TrustedBrands: React.FC = () => {
  const { brands, isLoading, error } = useTrustedBrands()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 0)
  const itemsPerView = windowWidth >= 768 ? 4 : 2

  // Calculate the number of visible items based on screen width
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // If loading or error, show appropriate message
  if (isLoading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-secondary-700">
            Meet the people we are working with
          </h2>
          <div className="flex justify-center">
            <div className="loader">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !brands || brands.length === 0) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-secondary-700">
            Meet the people we are working with
          </h2>
          <div className="text-center text-gray-500">
            {error ? "Error loading trusted brands." : "No trusted brands found."}
          </div>
        </div>
      </div>
    )
  }

  // Create an array that's arranged for infinite scrolling
  const getCarouselItems = () => {
    // Clone the brands array to work with
    const totalItems = brands.length

    // Create a display array with items before and after to create infinite effect
    let displayItems = []

    // Add items that would appear at the end for seamless backward scrolling
    for (let i = totalItems - itemsPerView; i < totalItems; i++) {
      displayItems.push({ ...brands[i], isClone: true })
    }

    // Add all original items
    displayItems = [...displayItems, ...brands.map((brand) => ({ ...brand, isClone: false }))]

    // Add beginning items at the end for seamless forward scrolling
    for (let i = 0; i < itemsPerView; i++) {
      displayItems.push({ ...brands[i], isClone: true })
    }

    return displayItems
  }

  const carouselItems = getCarouselItems()

  const nextItem = () => {
    if (isAnimating) return
    setIsAnimating(true)

    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex + 1
      // If we've scrolled past all real items, reset to first real item
      if (newIndex >= brands.length) {
        setTimeout(() => {
          setIsAnimating(false)
          setActiveIndex(0)
        }, 0)
        return brands.length
      }
      setTimeout(() => setIsAnimating(false), 300)
      return newIndex
    })
  }

  const prevItem = () => {
    if (isAnimating) return
    setIsAnimating(true)

    setActiveIndex((prevIndex) => {
      const newIndex = prevIndex - 1
      // If we've scrolled before first item, reset to last real item
      if (newIndex < 0) {
        setTimeout(() => {
          setIsAnimating(false)
          setActiveIndex(brands.length - 1)
        }, 0)
        return -1
      }
      setTimeout(() => setIsAnimating(false), 300)
      return newIndex
    })
  }

  // Calculate translation distance based on index
  const getTranslateValue = () => {
    // Initial offset to account for the prepended clones
    const baseOffset = itemsPerView
    const itemWidth = 100 / itemsPerView
    return `translateX(-${(baseOffset + activeIndex) * itemWidth}%)`
  }

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isSignificantSwipe = Math.abs(distance) > 50

    if (isSignificantSwipe) {
      if (distance > 0) {
        nextItem()
      } else {
        prevItem()
      }
    }

    setTouchStart(null)
    setTouchEnd(null)
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-secondary-700">Meet the people we are working with</h2>

        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={prevItem}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 focus:outline-none"
            aria-label="Previous brand"
            disabled={isAnimating}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-secondary-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Brands Display */}
          <div
            className="overflow-hidden mx-10 py-5"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: getTranslateValue() }}
            >
              {carouselItems.map((brand, index) => (
                <div
                  key={`${brand.id || index}-${index}`}
                  className={`px-4 flex-shrink-0 ${windowWidth >= 768 ? "w-1/4" : "w-1/2"} flex flex-col items-center`}
                >
                  <div className="bg-white rounded-lg shadow-sm p-6 w-full h-32 flex items-center justify-center">
                    <img
                      src={brand.imageSrc || "/placeholder.svg"}
                      alt={brand.altText}
                      className="max-h-16 max-w-full object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextItem}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 focus:outline-none"
            aria-label="Next brand"
            disabled={isAnimating}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-secondary-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-6">
          {brands.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full mx-1 ${activeIndex === index ? "bg-primary-500" : "bg-gray-300"}`}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true)
                  setActiveIndex(index)
                  setTimeout(() => setIsAnimating(false), 300)
                }
              }}
              aria-label={`Go to brand ${index + 1}`}
              disabled={isAnimating}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TrustedBrands

