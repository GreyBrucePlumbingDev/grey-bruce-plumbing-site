import { supabase } from '../lib/supabase';
import type { SitewideSettings, ServiceArea, Service } from '../types';

/**
 * Service for retrieving data from Supabase
 */
export const DataService = {
  /**
   * Gets company information from sitewide_settings
   */
  async getCompanyInfo(): Promise<SitewideSettings | null> {
    try {
      const { data, error } = await supabase
        .from('sitewide_settings')
        .select('*')
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error fetching company info:', error);
      return null;
    }
  },
  
  /**
   * Gets all service areas
   */
  async getServiceAreas(): Promise<ServiceArea[]> {
    try {
      const { data, error } = await supabase
        .from('service_areas')
        .select('*')
        .eq('is_main_address', false);
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching service areas:', error);
      return [];
    }
  },
  
  /**
   * Gets service by slug
   */
  async getServiceBySlug(slug: string): Promise<Service | null> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`Error fetching service with slug ${slug}:`, error);
      return null;
    }
  },
  
  /**
   * Gets all services
   */
  async getAllServices(): Promise<Service[]> {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*');
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  },
  
  /**
   * Searches services by keywords
   */
  async searchServices(keywords: string[]): Promise<Service[]> {
    try {
      // Get all services first
      const { data, error } = await supabase
        .from('services')
        .select('*');
      
      if (error) throw error;
      
      if (!data) return [];
      
      // Filter services that match keywords in title, overview, or summary
      return data.filter(service => {
        const searchText = `${service.title} ${service.overview} ${service.summary}`.toLowerCase();
        return keywords.some(keyword => searchText.includes(keyword.toLowerCase()));
      });
    } catch (error) {
      console.error('Error searching services:', error);
      return [];
    }
  },
};

