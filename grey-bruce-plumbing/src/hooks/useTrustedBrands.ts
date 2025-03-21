import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrustedBrand } from '../types/TrustedBrand';

type UseTrustedBrandsReturn = {
  brands: TrustedBrand[] | null;
  isLoading: boolean;
  error: Error | null;
  mutate: () => void;
};

export function useTrustedBrands(): UseTrustedBrandsReturn {
  const [brands, setBrands] = useState<TrustedBrand[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refreshIndex, setRefreshIndex] = useState<number>(0);

  useEffect(() => {
    async function fetchTrustedBrands() {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error: fetchError } = await supabase
          .from('trusted_brands')
          .select('*')
          .order('display_order', { ascending: true });
        
        if (fetchError) throw fetchError;
        
        // Map the database column names to our component's expected props
        const mappedBrands = data.map(brand => ({
          id: brand.id,
          name: brand.name,
          imageSrc: brand.image_src,
          altText: brand.alt_text,
          display_order: brand.display_order,
          created_at: brand.created_at,
          updated_at: brand.updated_at
        }));
        
        setBrands(mappedBrands);
      } catch (err) {
        console.error('Error fetching trusted brands:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch trusted brands'));
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchTrustedBrands();
  }, [refreshIndex]);

  const mutate = () => {
    setRefreshIndex(prev => prev + 1);
  };

  return { brands, isLoading, error, mutate };
}