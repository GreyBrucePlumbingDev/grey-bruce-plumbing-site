// src/hooks/useSitewideSettings.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useSitewideSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('sitewide_settings')
          .select('*')
          .limit(1)
          .single();

        if (error) {
          throw error;
        }

        setSettings(data);
      } catch (err) {
        setError(err);
        console.error('Error fetching sitewide settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
};