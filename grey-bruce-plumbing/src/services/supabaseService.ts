// src/services/supabaseService.ts

import { createClient } from '@supabase/supabase-js';
import { ServiceContent } from '../types/ServiceTypes';

// Initialize Supabase client (replace with your project URL and public anon key)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export const getServiceBySlug = async (slug: string): Promise<ServiceContent | null> => {
  try {
    // Fetch the main service data
    const { data: serviceData, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (serviceError) throw serviceError;
    if (!serviceData) return null;

    // Fetch benefits for this service
    const { data: benefits, error: benefitsError } = await supabase
      .from('service_benefits')
      .select('*')
      .eq('service_id', serviceData.id)
      .order('display_order', { ascending: true });
    
    if (benefitsError) throw benefitsError;

    // Fetch common problems
    const { data: problems, error: problemsError } = await supabase
      .from('service_problems')
      .select('*')
      .eq('service_id', serviceData.id)
      .order('display_order', { ascending: true });
    
    if (problemsError) throw problemsError;

    // Fetch process steps
    const { data: processSteps, error: processError } = await supabase
      .from('service_process')
      .select('*')
      .eq('service_id', serviceData.id)
      .order('step_number', { ascending: true });
    
    if (processError) throw processError;

    // Fetch related services
    const { data: relatedServices, error: relatedError } = await supabase
      .from('service_related')
      .select(`
        id,
        related_service:related_service_id (
          id,
          title,
          slug,
          description,
          image_url
        )
      `)
      .eq('service_id', serviceData.id);
    
    if (relatedError) throw relatedError;

    // Format the related services data to match our interface
    const formattedRelatedServices = relatedServices.map(item => {
      const rel = Array.isArray(item.related_service) ? item.related_service[0] : item.related_service;
      return {
        id: rel.id,
        title: rel.title,
        slug: rel.slug,
        description: rel.description,
        imageUrl: rel.image_url,
      };
    });

    // Compile the complete service object
    const service: ServiceContent = {
      id: serviceData.id,
      slug: serviceData.slug,
      title: serviceData.title,
      overview: serviceData.overview,
      benefits: benefits || [],
      commonProblems: problems || [],
      process: processSteps || [],
      relatedServices: formattedRelatedServices || [],
      imageUrl: serviceData.image_url,
    };

    return service;
  } catch (error) {
    console.error('Error fetching service data:', error);
    throw error;
  }
};

// Get all service slugs (useful for sitemap or dynamic page generation)
export const getAllServiceSlugs = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('services')
      .select('slug')
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    
    return data.map(item => item.slug);
  } catch (error) {
    console.error('Error fetching service slugs:', error);
    throw error;
  }
};