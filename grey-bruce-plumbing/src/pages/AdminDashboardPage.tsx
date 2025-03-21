import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SitewideSettingsEditor from '../components/AdminSections/SitewideSettingsEditor';
import ServiceAreaEditor from '../components/AdminSections/ServiceAreaEditor';
import TestimonialEditor from '../components/AdminSections/TestimonialEditor';
import TrustedBrandsEditor from '../components/AdminSections/TrustedBrandsEditor';
import AboutUsPreviewEditor from '../components/AdminSections/AboutUsPreviewEditor';
import AboutUsEditor from '../components/AdminSections/AboutUsEditor';

type AdminTab = 'sitewide' | 'services' | 'about-preview' | 'trusted-brands' | 'testimonials' | 'service-area' | 'about-page';

const AdminDashboardPage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('sitewide');

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header section */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs for different admin sections */}
        <div className="tabs tabs-boxed mb-6">
          <button 
            className={`tab ${activeTab === 'sitewide' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('sitewide')}
          >
            Sitewide Settings
          </button>
          <button 
            className={`tab ${activeTab === 'services' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Services
          </button>
          <button 
            className={`tab ${activeTab === 'about-preview' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('about-preview')}
          >
            About Preview
          </button>
          <button 
            className={`tab ${activeTab === 'trusted-brands' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('trusted-brands')}
          >
            Trusted Brands
          </button>
          <button 
            className={`tab ${activeTab === 'testimonials' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('testimonials')}
          >
            Testimonials
          </button>
          <button 
            className={`tab ${activeTab === 'service-area' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('service-area')}
          >
            Service Area
          </button>
          <button 
            className={`tab ${activeTab === 'about-page' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('about-page')}
          >
            About Page
          </button>
        </div>
        
        {/* Content area where the settings editor is displayed */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          {activeTab === 'sitewide' && <SitewideSettingsEditor />}
          {activeTab === 'service-area' && <ServiceAreaEditor />}
          {activeTab === 'testimonials' && <TestimonialEditor />}
          {activeTab === 'trusted-brands' && <TrustedBrandsEditor />}
          {activeTab === 'about-preview' && <AboutUsPreviewEditor />}
          {activeTab === 'about-page' && <AboutUsEditor />}
          {/* Other tab content components will be added here */}
          {(activeTab !== 'sitewide' && activeTab !== 'service-area' && activeTab !== 'testimonials' && activeTab !== 'trusted-brands' && activeTab !== 'about-preview' && activeTab !== 'about-page') && (
            <div className="text-center py-12 text-gray-500">
              This section is under development
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;