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

const HomePage = () => {
  useEffect(() => {
    // Check Supabase connection when the homepage loads
    checkSupabaseConnection()
  }, [])

  return (
    <div>
      <HeroSection />
      <PopularServices />
      <AboutUsPreview />
      <Testimonials />
      <BlogPreview />
      <EmergencyCallout />
      <ServiceAreaMap />
      <ContactUs />
    </div>
  )
}

export default HomePage