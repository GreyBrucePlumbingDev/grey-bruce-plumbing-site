import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import DocumentHead from '../components/DocumentHead';

// Define interfaces for your data types
interface CompanyHistory {
  title: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
}

interface Certification {
  id: number;
  name: string;
  icon: string;
}

interface ExpertiseSection {
  title: string;
  content: string;
  certifications: Certification[];
  imageUrl: string;
  imageAlt: string;
}

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  image_url: string;
}

interface CareerSection {
  title: string;
  content: string;
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
  imageAlt: string;
}

const AboutPage = () => {
  // State for storing data from Supabase
  const [loading, setLoading] = useState(true);
  const [companyHistory, setCompanyHistory] = useState<CompanyHistory | null>(null);
  const [expertiseSection, setExpertiseSection] = useState<ExpertiseSection | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [careerSection, setCareerSection] = useState<CareerSection | null>(null);

  useEffect(() => {
    // This is where you'll fetch data from Supabase in the future
    const fetchAboutPageData = async () => {
      try {
        setLoading(true);
        
        // Example of future implementation:
        const { data: historyData } = await supabase.from('company_history').select('*').single();
        const { data: expertiseData } = await supabase.from('expertise_section').select('*').single();
        const { data: certificationsData } = await supabase.from('certifications').select('*');


        const { data: teamData } = await supabase.from('team_members').select('*');
        const { data: careerData } = await supabase.from('career_section').select('*').single();
        
        setCompanyHistory({
          title: historyData?.title || "Company History",
          content: historyData?.content || "Your company history content here.",
          imageUrl: historyData?.image_url || "/placeholder-history.jpg",
          imageAlt: historyData?.image_alt || "Company History"
        });
        
        setExpertiseSection({
          title: expertiseData?.title || "Certifications and Expertise",
          content: expertiseData?.content || "Your certifications content here.",
          certifications: certificationsData || [],
          imageUrl: expertiseData?.image_url || "/placeholder-expertise.jpg",
          imageAlt: expertiseData?.image_alt || "Certifications and Expertise"
        });
        
        setTeamMembers(teamData || []);
        
        setCareerSection({
          title: careerData?.title || "Join Our Team",
          content: careerData?.content || "Your career section content here.",
          buttonText: careerData?.button_text || "Apply Now",
          buttonUrl: careerData?.button_url || "/careers/apply",
          imageUrl: careerData?.image_url || "/placeholder-careers.jpg",
          imageAlt: careerData?.image_alt || "Join Our Team"
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching about page data:", error);
        setLoading(false);
      }
    };
    
    fetchAboutPageData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <>
        <DocumentHead pageTitle="About Us" />
        <div className="container mx-auto px-4 py-16 flex justify-center items-center">
          <div className="text-center">
            <p className="text-xl text-[#152f59]">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DocumentHead pageTitle="About Us" />
      <div className="container mx-auto px-4 py-8">
        {/* Company History Section */}
        {companyHistory && (
          <section className="mb-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold text-[#152f59] mb-4">{companyHistory.title}</h2>
                <div className="space-y-4">
                {companyHistory?.content ? (
                  <div 
                    className="text-gray-700 mb-4 prose max-w-none" 
                    dangerouslySetInnerHTML={{ __html: companyHistory.content }}
                  />
                ) : (
                  <p className="text-gray-700 mb-4">
                    loading...
                  </p>
                )}
                </div>
              </div>
              <div className="w-full md:w-1/2">
                {companyHistory.imageUrl ? (
                  <img 
                    src={companyHistory.imageUrl} 
                    alt={companyHistory.imageAlt} 
                    className="w-full h-auto rounded-lg object-cover"
                  />
                ) : (
                  <div className="aspect-video w-full bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Company History Image</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Certifications and Expertise Section */}
        {expertiseSection && (
          <section className="mb-16 bg-gray-50 p-8 rounded-lg">
            <div className="flex flex-col-reverse md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                {expertiseSection.imageUrl ? (
                  <img 
                    src={expertiseSection.imageUrl} 
                    alt={expertiseSection.imageAlt} 
                    className="w-full h-auto rounded-lg object-cover"
                  />
                ) : (
                  <div className="aspect-video w-full bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">Certifications Image</span>
                  </div>
                )}
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-bold text-[#152f59] mb-4">{expertiseSection.title}</h2>
                <div className="space-y-4">
                  {expertiseSection?.content ? (
                    <div 
                      className="text-gray-700 mb-4 prose max-w-none" 
                      dangerouslySetInnerHTML={{ __html: expertiseSection.content }}
                    />
                    ) : (
                    <p className="text-gray-700 mb-4">
                      loading...
                    </p>
                  )}                
                  {/* Certification icons/badges */}
                  {expertiseSection.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-6">
                      {expertiseSection.certifications.map((cert) => (
                        <div key={cert.id} className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {cert.icon ? (
                            <img src={cert.icon} alt={cert.name} className="w-12 h-12 object-contain" />
                          ) : (
                            <span className="text-xs text-gray-500">{cert.name}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Our Team Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[#152f59] mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.length > 0 ? (
              teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="aspect-square bg-gray-200 overflow-hidden">
                    {member.image_url ? (
                      <img 
                        src={member.image_url} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500">Team Member Photo</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-[#152f59]">{member.name}</h3>
                    <p className="text-[#7ac144] font-medium">{member.position}</p>
                    {member?.bio ? (
                      <div 
                        className="text-gray-700 mb-4 prose max-w-none" 
                        dangerouslySetInnerHTML={{ __html: member?.bio }}
                      />
                      ) : (
                      <p className="text-gray-700 mb-4">
                        loading...
                      </p>
                    )}       
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-500">No team members found</p>
              </div>
            )}
          </div>
        </section>

        {/* Join the Team Section */}
        {careerSection && (
          <section className="mb-8 bg-[#152f59] text-white p-8 rounded-lg">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-2/3">
                <h2 className="text-3xl font-bold mb-4">{careerSection?.title}</h2>
                <div className="space-y-4">
                  {careerSection?.content ? (
                    <div 
                      className="text-white mb-4 prose max-w-none" 
                      dangerouslySetInnerHTML={{ __html: careerSection?.content }}
                    />
                  ) : (
                    <p className="text-gray-700 mb-4">
                      loading...
                    </p>
                  )}
                  <Link to={careerSection.buttonUrl}>
                    <button className="mt-6 bg-[#7ac144] hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-lg transition-all">
                      {careerSection.buttonText}
                    </button>
                  </Link>
                </div>
              </div>
              <div className="w-full md:w-1/3">
                {careerSection.imageUrl ? (
                  <img 
                    src={careerSection.imageUrl} 
                    alt={careerSection.imageAlt} 
                    className="w-full h-auto rounded-lg object-cover"
                  />
                ) : (
                  <div className="aspect-square w-full bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-gray-300">Join Team Image</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default AboutPage;