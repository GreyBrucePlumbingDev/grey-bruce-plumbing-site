import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface DocumentHeadProps {
  pageTitle?: string;
}

const DocumentHead: React.FC<DocumentHeadProps> = ({ pageTitle }) => {
  const location = useLocation();
  const [companyName, setCompanyName] = React.useState<string>('');
  const [faviconUrl, setFaviconUrl] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      const { data } = await supabase
        .from('sitewide_settings')
        .select('company_name, favicon_url')
        .limit(1);
        
      if (data && data.length > 0) {
        setCompanyName(data[0].company_name);
        setFaviconUrl(data[0].favicon_url);
      }
    };
    
    fetchSiteSettings();
  }, []);

  useEffect(() => {
    // Update document title
    if (companyName) {
      const title = pageTitle 
        ? `${companyName} | ${pageTitle}` 
        : companyName;
      document.title = title;
    }
    
    // Update favicon
    if (faviconUrl) {
      const existingFavicon = document.querySelector("link[rel='icon']");
      if (existingFavicon) {
        (existingFavicon as HTMLLinkElement).href = faviconUrl;
      } else {
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = faviconUrl;
        document.head.appendChild(favicon);
      }
    }
  }, [companyName, faviconUrl, pageTitle, location]);
  
  return null;
};

export default DocumentHead;