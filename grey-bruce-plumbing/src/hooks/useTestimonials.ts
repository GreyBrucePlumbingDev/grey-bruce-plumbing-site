import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Define the Testimonial type based on your Supabase table structure
export interface Testimonial {
  id: string; 
  name: string;
  rating: number;
  description: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setTestimonials(data as Testimonial[]);
      } catch (err) {
        setError(err);
        console.error('Error fetching testimonials:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return { testimonials, loading, error };
};