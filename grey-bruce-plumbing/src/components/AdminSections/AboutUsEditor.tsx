import React, { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import CompanyHistoryEditor from '../AdminSections/AboutUsEditors/CompanyHistoryEditor';
import ExpertiseSectionEditor from './AboutUsEditors/ExpertiseSectionEditor';
import TeamMembersEditor from './AboutUsEditors/TeamMembersEditor';
import CareerSectionEditor from './AboutUsEditors/CareerSectionEditor';

// Types for About page sections
export interface CompanyHistory {
  id?: string;
  title: string;
  content: string;
  imageUrl: string;
  imageAlt: string;
}

export interface Certification {
  id: number;
  name: string;
  icon: string;
}

export interface ExpertiseSection {
  id?: string;
  title: string;
  content: string;
  certifications: Certification[];
  imageUrl: string;
  imageAlt: string;
}

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
}

export interface CareerSection {
  id?: string;
  title: string;
  content: string[];
  buttonText: string;
  buttonUrl: string;
  imageUrl: string;
  imageAlt: string;
}

// Main component
const AboutUsEditor: React.FC = () => {
  // State for notifications
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<number>(0);

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">About Us Page Editor</h1>
      
      {notification && (
        <div className={`alert ${notification.type === 'success' ? 'alert-success' : 'alert-error'} mb-4`}>
          <div>
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <TabGroup selectedIndex={activeTab} onChange={setActiveTab}>
        <TabList className="tabs tabs-boxed mb-6">
          <Tab className={({ selected }) => 
            `tab ${selected ? 'tab-active bg-blue-600 text-white' : ''}`
          }>
            Company History
          </Tab>
          <Tab className={({ selected }) => 
            `tab ${selected ? 'tab-active bg-blue-600 text-white' : ''}`
          }>
            Expertise & Certifications
          </Tab>
          <Tab className={({ selected }) => 
            `tab ${selected ? 'tab-active bg-blue-600 text-white' : ''}`
          }>
            Team Members
          </Tab>
          <Tab className={({ selected }) => 
            `tab ${selected ? 'tab-active bg-blue-600 text-white' : ''}`
          }>
            Career Section
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <CompanyHistoryEditor showNotification={showNotification} />
          </TabPanel>
          <TabPanel>
            <ExpertiseSectionEditor showNotification={showNotification} />
          </TabPanel>
          <TabPanel>
            <TeamMembersEditor showNotification={showNotification} />
          </TabPanel>
          <TabPanel>
            <CareerSectionEditor showNotification={showNotification} />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default AboutUsEditor;