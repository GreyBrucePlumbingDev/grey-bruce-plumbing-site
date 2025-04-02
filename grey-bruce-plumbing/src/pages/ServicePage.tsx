"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import type { ServiceContent } from "../types/ServiceTypes"
import { getServiceBySlug } from "../services/supabaseService"
import { useSitewideSettings } from "../hooks/useSitewideSettings"
import type { SitewideSettings } from "../types/SitewideSettings"
import DocumentHead from "../components/DocumentHead"
import Container from "../components/common/Container"

const ServicePage = () => {
  const { serviceSlug } = useParams<{ serviceSlug: string }>()
  const [service, setService] = useState<ServiceContent | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { settings } = useSitewideSettings() as { settings: SitewideSettings | null; loading: boolean }

  useEffect(() => {
    const fetchServiceData = async () => {
      if (!serviceSlug) return

      setIsLoading(true)
      setError(null)

      try {
        const serviceData = await getServiceBySlug(serviceSlug)
        setService(serviceData)
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load service information. Please try again later.")
        setIsLoading(false)
        console.error("Error fetching service data:", err)
      }
    }

    fetchServiceData()
  }, [serviceSlug])

  if (isLoading) {
    return (
      <>
        <DocumentHead pageTitle="Loading Service..." />
        <div className="min-h-[60vh] flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-secondary-700 font-medium">Loading service details...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <DocumentHead pageTitle="Service Error" />
        <Container>
          <div className="min-h-[60vh] flex justify-center items-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-red-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Service</h2>
              <p className="text-gray-700">{error}</p>
              <Link
                to="/services"
                className="mt-6 inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                View All Services
              </Link>
            </div>
          </div>
        </Container>
      </>
    )
  }

  if (!service) {
    return (
      <>
        <DocumentHead pageTitle="Service Not Found" />
        <Container>
          <div className="min-h-[60vh] flex justify-center items-center">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-secondary-700 mb-2">Service Not Found</h2>
              <p className="text-gray-700">The requested service information could not be found.</p>
              <Link
                to="/services"
                className="mt-6 inline-block bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                View All Services
              </Link>
            </div>
          </div>
        </Container>
      </>
    )
  }

  return (
    <>
      <DocumentHead pageTitle={service.title} />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-secondary-800 to-secondary-700 text-white">
        <Container>
          <div className="py-12 md:py-16 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{service.title}</h1>
              <div
                className="prose prose-lg prose-invert max-w-none mb-6"
                dangerouslySetInnerHTML={{ __html: service.overview }}
              />
              <a
                href={settings?.booking_link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary text-white border-none px-6 py-3"
              >
                Book Now
              </a>
            </div>
            <div className="md:w-1/3 flex justify-center">
              {service.imageUrl ? (
                <img
                  src={service.imageUrl || "/placeholder.svg"}
                  alt={service.title}
                  className="rounded-lg w-full max-w-sm object-cover shadow-lg"
                />
              ) : (
                <div className="bg-secondary-600 rounded-lg w-full max-w-sm aspect-video flex items-center justify-center">
                  <span className="text-white opacity-70">Service Image</span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {/* Benefits Section */}
        {service.benefits && service.benefits.length > 0 && (
          <section className="py-12 md:py-16">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-700 mb-8 text-center">
              Benefits of Our {service.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondary-700 mb-3">{benefit.title}</h3>
                    <div
                      className="prose prose-sm max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: benefit.description }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Common Problems Section */}
        {service.commonProblems && service.commonProblems.length > 0 && (
          <section className="py-12 md:py-16 bg-gray-50 -mx-4 px-4">
            <Container>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary-700 mb-8 text-center">
                Common Problems We Solve
              </h2>
              <div className="space-y-6">
                {service.commonProblems.map((problem) => (
                  <div key={problem.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-secondary-700 mb-3">{problem.title}</h3>
                      <div
                        className="prose max-w-none text-gray-700 mb-4"
                        dangerouslySetInnerHTML={{ __html: problem.description }}
                      />
                      {problem.solution && (
                        <div className="mt-4 border-t border-gray-100 pt-4">
                          <h4 className="font-semibold text-primary-500 mb-2">Our Solution</h4>
                          <div
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: problem.solution }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Service Process Section */}
        {service.process && service.process.length > 0 && (
          <section className="py-12 md:py-16">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-700 mb-8 text-center">Our Service Process</h2>
            <div className="relative">
              {service.process.map((step, index) => (
                <div key={step.id} className="flex mb-12 last:mb-0 relative">
                  <div className="mr-6 relative">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary-700 text-white font-bold text-xl">
                      {step.stepNumber}
                    </div>
                    {index < service.process.length - 1 && (
                      <div className="absolute top-12 bottom-0 left-6 w-0.5 bg-primary-500"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                      <h3 className="text-xl font-semibold text-secondary-700 mb-3">{step.title}</h3>
                      <div
                        className="prose max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: step.description }}
                      />
                      {step.imageUrl && (
                        <img
                          src={step.imageUrl || "/placeholder.svg"}
                          alt={step.title}
                          className="mt-4 rounded-lg max-h-60 object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Services Section */}
        {service.relatedServices && service.relatedServices.length > 0 && (
          <section className="py-12 md:py-16 bg-gray-50 -mx-4 px-4">
            <Container>
              <h2 className="text-2xl md:text-3xl font-bold text-secondary-700 mb-8 text-center">Related Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.relatedServices.map((relatedService) => (
                  <Link
                    key={relatedService.id}
                    to={`/services/${relatedService.slug}`}
                    className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 group overflow-hidden flex flex-col h-full"
                  >
                    <div className="overflow-hidden h-48">
                      {relatedService.imageUrl ? (
                        <img
                          src={relatedService.imageUrl || "/placeholder.svg"}
                          alt={relatedService.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">Service Image</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold text-secondary-700 mb-2 group-hover:text-primary-500 transition-colors">
                        {relatedService.title}
                      </h3>
                      <p className="text-gray-700 mb-4 flex-1">{relatedService.description}</p>
                      <div className="text-primary-500 font-semibold flex items-center mt-auto">
                        Learn More
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12 md:py-16">
          <div className="bg-gradient-to-r from-secondary-700 to-secondary-600 text-white rounded-lg overflow-hidden shadow-xl">
            <div className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Contact us today for professional plumbing services you can trust. Our team of experts is ready to help
                with all your {service.title.toLowerCase()} needs.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <a
                  href={settings?.booking_link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary text-white border-none px-8 py-3"
                >
                  Book Now
                </a>
                <a
                  href={`tel:${settings?.phone_number || ""}`}
                  className="btn bg-white text-secondary-700 hover:bg-gray-100 border-none px-8 py-3"
                >
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </>
  )
}

export default ServicePage

