"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import DocumentHead from "../components/DocumentHead"
import Container from "../components/common/Container"
import { useAboutUs } from "../hooks/useAboutUs"

// Define interfaces for your data types
interface CompanyHistory {
  title: string
  content: string
  imageUrl: string
  imageAlt: string
}

interface Certification {
  id: number
  name: string
  icon: string
}

interface ExpertiseSection {
  title: string
  content: string
  certifications: Certification[]
  imageUrl: string
  imageAlt: string
}

interface TeamMember {
  id: number
  name: string
  position: string
  bio: string
  image_url: string
}

interface CareerSection {
  title: string
  content: string
  buttonText: string
  buttonUrl: string
  imageUrl: string
  imageAlt: string
}

const AboutPage = () => {
  // State for storing data from Supabase
  const [loading, setLoading] = useState(true)
  const [companyHistory, setCompanyHistory] = useState<CompanyHistory | null>(null)
  const [expertiseSection, setExpertiseSection] = useState<ExpertiseSection | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [careerSection, setCareerSection] = useState<CareerSection | null>(null)
  const { aboutUsContent } = useAboutUs()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAboutPageData = async () => {
      try {
        setLoading(true)

        // Fetch data from Supabase
        const { data: historyData } = await supabase.from("company_history").select("*").single()
        const { data: expertiseData } = await supabase.from("expertise_section").select("*").single()
        const { data: certificationsData } = await supabase.from("certifications").select("*")
        const { data: teamData } = await supabase.from("team_members").select("*")
        const { data: careerData } = await supabase.from("career_section").select("*").single()

        setCompanyHistory({
          title: historyData?.title || "Our History",
          content: historyData?.content || "Your company history content here.",
          imageUrl: historyData?.image_url || "/placeholder-history.jpg",
          imageAlt: historyData?.image_alt || "Company History",
        })

        setExpertiseSection({
          title: expertiseData?.title || "Our Expertise",
          content: expertiseData?.content || "Your certifications content here.",
          certifications: certificationsData || [],
          imageUrl: expertiseData?.image_url || "/placeholder-expertise.jpg",
          imageAlt: expertiseData?.image_alt || "Certifications and Expertise",
        })

        setTeamMembers(teamData || [])

        setCareerSection({
          title: careerData?.title || "Join Our Team",
          content: careerData?.content || "Your career section content here.",
          buttonText: careerData?.button_text || "Apply Now",
          buttonUrl: careerData?.button_url || "/careers/apply",
          imageUrl: careerData?.image_url || "/placeholder-careers.jpg",
          imageAlt: careerData?.image_alt || "Join Our Team",
        })

        setLoading(false)
      } catch (error) {
        console.error("Error fetching about page data:", error)
        setLoading(false)
      }
    }

    fetchAboutPageData()
  }, [])

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Navigate to home page first
    navigate('/')
    
    // Wait for navigation to complete before scrolling
    setTimeout(() => {
      const contactSection = document.getElementById('contact')
      if (contactSection) {
        const offset = 10 // Adjust this value based on your navbar height
        const elementPosition = contactSection.getBoundingClientRect().top + window.scrollY
        const offsetPosition = elementPosition + offset
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    }, 1000) // Small timeout to ensure the page has loaded
  }

  // Loading state
  if (loading) {
    return (
      <>
        <DocumentHead pageTitle="About Us" />
        <div className="min-h-[60vh] flex justify-center items-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500"></div>
            <p className="mt-4 text-secondary-700 font-medium">Loading about us information...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <DocumentHead pageTitle="About Us" />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-secondary-800 to-secondary-700 text-white">
        <Container>
          <div className="py-12 md:py-20 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">About Grey-Bruce Plumbing</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              {aboutUsContent?.years_in_business
                ? `Serving the Grey-Bruce region with excellence for over ${aboutUsContent.years_in_business} years.`
                : "Serving the Grey-Bruce region with excellence for years."}
            </p>
          </div>
        </Container>
      </div>

      <Container>
        {/* Company Overview Section */}
        <section className="py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="md:w-1/2">
              {aboutUsContent?.content ? (
                <div
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: aboutUsContent.content }}
                />
              ) : (
                <div className="prose prose-lg max-w-none">
                  <p>
                    Grey-Bruce Plumbing has been serving Owen Sound and the surrounding areas with reliable,
                    transparent, and efficient plumbing solutions for years. As licensed Class 4 Well Technicians and
                    Certified Backflow Specialists, we combine expertise with modern conveniences.
                  </p>
                </div>
              )}

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-start">
                    <div className="text-primary-500 mr-3 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary-700">Priority Emergency Service</h3>
                      <p className="text-gray-600">Available 24/7 for your urgent plumbing needs</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-start">
                    <div className="text-primary-500 mr-3 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary-700">"On My Way" Text Alerts</h3>
                      <p className="text-gray-600">No more waiting in the dark</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-start">
                    <div className="text-primary-500 mr-3 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary-700">Free Estimates</h3>
                      <p className="text-gray-600">Upfront pricing, no surprises</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-start">
                    <div className="text-primary-500 mr-3 mt-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary-700">Licensed Professionals</h3>
                      <p className="text-gray-600">Fully certified and insured technicians</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <div className="relative">
                {aboutUsContent?.image_url ? (
                  <img
                    src={aboutUsContent.image_url || "/placeholder.svg"}
                    alt="Grey-Bruce Plumbing Team"
                    className="rounded-lg shadow-lg w-full h-auto object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 rounded-lg aspect-video w-full flex items-center justify-center">
                    <span className="text-gray-500">Team Photo</span>
                  </div>
                )}
                <div className="absolute -bottom-6 -right-6 bg-primary-500 text-white py-3 px-6 rounded-lg shadow-lg hidden md:block">
                  <p className="font-bold text-xl">
                    {aboutUsContent?.years_in_business ? `${aboutUsContent.years_in_business}+ Years` : "Years"} of
                    Experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company History Section */}
        {companyHistory && (
          <section className="py-12 md:py-16 bg-gray-50 -mx-4 px-4">
            <Container>
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="md:w-1/2 order-2 md:order-1">
                  {companyHistory.imageUrl ? (
                    <img
                      src={companyHistory.imageUrl || "/placeholder.svg"}
                      alt={companyHistory.imageAlt}
                      className="rounded-lg shadow-lg w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="bg-gray-200 rounded-lg aspect-video w-full flex items-center justify-center">
                      <span className="text-gray-500">Company History Image</span>
                    </div>
                  )}
                </div>
                <div className="md:w-1/2 order-1 md:order-2">
                  <h2 className="text-3xl font-bold text-secondary-700 mb-6">{companyHistory.title}</h2>
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: companyHistory.content }}
                  />
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* Certifications and Expertise Section */}
        {expertiseSection && (
          <section className="py-12 md:py-16">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-secondary-700 mb-6">{expertiseSection.title}</h2>
                <div
                  className="prose prose-lg max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: expertiseSection.content }}
                />

                {/* Certification icons/badges */}
                {expertiseSection.certifications.length > 0 && (
                  <div className="flex flex-wrap gap-6 mt-6">
                    {expertiseSection.certifications.map((cert) => (
                      <div
                        key={cert.id}
                        className="bg-white shadow-md rounded-full p-2 flex items-center justify-center w-20 h-20 border border-gray-100"
                      >
                        {cert.icon ? (
                          <img
                            src={cert.icon || "/placeholder.svg"}
                            alt={cert.name}
                            className="w-14 h-14 object-contain"
                          />
                        ) : (
                          <div className="text-xs text-center text-gray-500 px-1">{cert.name}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="md:w-1/2">
                {expertiseSection.imageUrl ? (
                  <img
                    src={expertiseSection.imageUrl || "/placeholder.svg"}
                    alt={expertiseSection.imageAlt}
                    className="rounded-lg shadow-lg w-full h-auto object-cover"
                  />
                ) : (
                  <div className="bg-gray-200 rounded-lg aspect-video w-full flex items-center justify-center">
                    <span className="text-gray-500">Expertise Image</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Our Team Section */}
        <section className="py-12 md:py-16 bg-gray-50 -mx-4 px-4">
          <Container>
            <h2 className="text-3xl font-bold text-secondary-700 mb-8 text-center">Meet Our Team</h2>

            {teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="aspect-square overflow-hidden">
                      {member.image_url ? (
                        <img
                          src={member.image_url || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500">Team Member Photo</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-secondary-700">{member.name}</h3>
                      <p className="text-primary-500 font-medium mb-4">{member.position}</p>
                      <div
                        className="prose prose-sm max-w-none text-gray-700"
                        dangerouslySetInnerHTML={{ __html: member.bio }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-gray-600">No team members found</p>
              </div>
            )}
          </Container>
        </section>

        {/* Join the Team Section */}
        {careerSection && (
          <section className="py-12 md:py-16">
            <div className="bg-gradient-to-r from-secondary-700 to-secondary-600 text-white rounded-lg overflow-hidden shadow-xl">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 p-8 md:p-12">
                  <h2 className="text-3xl font-bold mb-6">{careerSection.title}</h2>
                  <div
                    className="prose prose-lg prose-invert max-w-none mb-8"
                    dangerouslySetInnerHTML={{ __html: careerSection.content }}
                  />
                  <Link
                    to={careerSection.buttonUrl}
                    className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    {careerSection.buttonText}
                  </Link>
                </div>
                <div className="md:w-1/3">
                  {careerSection.imageUrl ? (
                    <img
                      src={careerSection.imageUrl || "/placeholder.svg"}
                      alt={careerSection.imageAlt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full min-h-[300px] bg-secondary-800 flex items-center justify-center">
                      <span className="text-white opacity-70">Career Image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-12 md:py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-secondary-700 mb-6">Ready to Work With Us?</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
              Whether you need emergency plumbing services or are planning a renovation, our team is ready to help you
              with professional solutions tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/services" className="btn btn-primary text-white border-none px-8 py-3">
                Explore Our Services
              </Link>
              <button
                onClick={handleContactClick}
                className="btn bg-secondary-700 hover:bg-secondary-800 text-white border-none px-8 py-3"
              >
                Contact Us
            </button>
            </div>
          </div>
        </section>
      </Container>
    </>
  )
}

export default AboutPage

