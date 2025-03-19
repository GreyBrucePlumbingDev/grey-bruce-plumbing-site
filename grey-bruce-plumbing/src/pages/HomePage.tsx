// src/pages/HomePage.tsx
import { useEffect } from 'react'
import { checkSupabaseConnection } from '../lib/supabase'
import HeroSection from '../components/sections/HeroSection';
import PopularServices from '../components/sections/PopularServices';
import AboutUsPreview from '../components/sections/AboutUsPreview';
import Testimonials from '../components/sections/Testimonials';
import BlogPreview from '../components/sections/BlogPreview';
import EmergencyCallout from '../components/sections/EmergencyCallout';
import ServiceAreaMap from '../components/sections/ServiceAreaMap';
import ContactUs from '../components/sections/ContactUs';
import Container from '../components/common/Container';
import TrustedBrands from '../components/sections/TrustedBrands';

const HomePage = () => {
  useEffect(() => {
    // Check Supabase connection when the homepage loads
    checkSupabaseConnection()
  }, [])

  return (
    <div>
      <section id="home">
        <HeroSection />
      </section>

      <section id="services" className="py-12">
          <PopularServices />
      </section>
      
      <section id="about" className="py-12 bg-gray-50">
        <Container>
          <AboutUsPreview />
        </Container>
      </section>

      <section className="py-12">
        <TrustedBrands />
      </section>
      
      <section id="reviews" className="py-12">
        <Container>
          <Testimonials />
        </Container>
      </section>
      
      <section id="blog" className="py-12 bg-gray-50">
        <Container>
          <BlogPreview />
        </Container>
      </section>
      
      <section className="py-12">
        
          <EmergencyCallout />
        
      </section>

      <section id="serviceArea" className="py-12 bg-gray-50">
        <Container>
          <ServiceAreaMap />
        </Container>
      </section>

      <section id='contact' className="py-12">
        <Container>
          <ContactUs />
        </Container>
      </section>
    </div>
  )
}

export default HomePage