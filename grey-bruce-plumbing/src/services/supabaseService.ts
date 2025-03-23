// src/services/supabaseService.ts

import { createClient } from '@supabase/supabase-js';
import { RelatedService, ServiceContent } from '../types/ServiceTypes';

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
      .from('services')
      .select('benefits')
      .eq('id', serviceData.id)
      .single();
    
    if (benefitsError) throw benefitsError;

    // Fetch common problems
    const { data: problems, error: problemsError } = await supabase
      .from('services')
      .select('commonProblems')
      .eq('id', serviceData.id)
      .single();
    
    if (problemsError) throw problemsError;

    // Fetch process steps
    const { data: processSteps, error: processError } = await supabase
      .from('services')
      .select('process')
      .eq('id', serviceData.id)
      .single();
    
    if (processError) throw processError;

    // Fetch related services
    const { data: relatedServices, error: relatedError } = await supabase
      .from('services')
      .select(`id, relatedServices`)
      .eq('id', serviceData.id)
      .single();
    
    if (relatedError) throw relatedError;

    // Format the related services data to match our interface
    const formattedRelatedServices = relatedServices.relatedServices.map((item : RelatedService) => {
      return {
        id: item.id,
        title: item.title,
        slug: item.slug,
        description: item.description,
        imageUrl: item.imageUrl,
      };
    });

    // Compile the complete service object
    const service: ServiceContent = {
      id: serviceData.id,
      slug: serviceData.slug,
      title: serviceData.title,
      overview: serviceData.overview,
      benefits: benefits?.benefits || [],
      commonProblems: problems?.commonProblems || [],
      process: processSteps?.process || [],
      relatedServices: formattedRelatedServices || [],
      imageUrl: serviceData.imageUrl,
      summary: serviceData.summary,
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
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data.map(item => item.slug);
  } catch (error) {
    console.error('Error fetching service slugs:', error);
    throw error;
  }
};