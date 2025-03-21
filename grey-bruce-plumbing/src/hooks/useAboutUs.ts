// src/hooks/useAboutUs.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Define the interface for the AboutUs content
export interface AboutUsContent {
  id: string;
  content: string;
  image_url: string;
  years_in_business: number;
  created_at: string;
  updated_at: string;
}

export const useAboutUs = () => {
  const [aboutUsContent, setAboutUsContent] = useState<AboutUsContent | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get the most recently updated about_us entry
        const { data, error: fetchError } = await supabase
          .from('about_us')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .single();

        if (fetchError) {
          // If no data exists yet, this is not a real error for the UI
          if (fetchError.code === 'PGRST116') {
            setAboutUsContent(null);
          } else {
            throw new Error(fetchError.message);
          }
        } else {
          setAboutUsContent(data as AboutUsContent);
        }
      } catch (err) {
        console.error('Error fetching about us content:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUs();
  }, []);

  // Function to refresh the data (useful after updates)
  const refreshAboutUs = async () => {
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('about_us')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (fetchError) {
        if (fetchError.code !== 'PGRST116') {
          throw new Error(fetchError.message);
        }
        setAboutUsContent(null);
      } else {
        setAboutUsContent(data as AboutUsContent);
      }
      setError(null);
    } catch (err) {
      console.error('Error refreshing about us content:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { aboutUsContent, loading, error, refreshAboutUs };
};