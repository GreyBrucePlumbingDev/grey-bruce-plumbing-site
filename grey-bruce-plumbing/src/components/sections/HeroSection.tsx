"use client"

// src/components/HeroSection.tsx
import { useSitewideSettings } from "../../hooks/useSitewideSettings"
import type { SitewideSettings } from "../../types/SitewideSettings"

const HeroSection = () => {
  const { settings } = useSitewideSettings() as { settings: SitewideSettings | null; loading: boolean }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = -80 // Adjust this value based on your navbar height
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const offsetPosition = elementPosition + offset
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <div id="home" className="hero min-h-screen bg-white relative">
      <div className="hero-content text-center z-10 max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center">
          <h1 className="mb-5 text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-700 dark:text-white">
            Residential & Commercial Plumbing Services
          </h1>
          <h2 className="mb-5 text-xl md:text-2xl lg:text-3xl font-semibold text-primary-500">
            Trusted experts in Owen Sound & Surrounding Areas
          </h2>
          <p className="mb-8 text-base md:text-lg max-w-2xl text-gray-700 dark:text-gray-200">
            ✔ 24/7 Emergency Service
            <br />✔ Licensed Master Plumbers & Certified Backflow Specialists
            <br />✔ Comprehensive Solutions: Drains, Wells, Water Treatment & More
            <br />✔ Tech-Forward Service: Real-time booking updates & Digital billing
            <br />
          </p>
          <div className="flex flex-col md:flex-row gap-4 mb-12 w-full max-w-md justify-center">
            <a
              href={settings?.booking_link}
              className="btn bg-primary-500 hover:bg-primary-600 text-white border-none shadow-md"
            >
              Book Now
            </a>
            <button
              className="btn bg-secondary-700 hover:bg-secondary-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-secondary-700 border-none shadow-md"
              onClick={() => scrollToSection("contact")}
            >
              Contact Us
            </button>
          </div>
          <button
            onClick={() => scrollToSection("about")}
            className="flex items-center text-primary-500 hover:text-secondary-700 dark:hover:text-white transition-colors duration-300 group"
          >
            <span className="text-lg font-medium border-b-2 border-primary-500 group-hover:border-secondary-700 dark:group-hover:border-white pb-1">
              Learn More
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <img
          src="/src/assets/plumbing-hero.jpg"
          alt="Plumbing Services"
          className="w-full h-full object-cover opacity-10 dark:opacity-30"
        />
      </div>
    </div>
  )
}

export default HeroSection

