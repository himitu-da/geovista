
import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { CountryData } from '@/types/country';
import { captureException } from '@/lib/sentry';

export function useCountryData() {
  const [countries, setCountries] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        
        // This assumes a 'countries' table in your Supabase database
        const { data, error } = await supabase
          .from('countries')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          setCountries(data as CountryData[]);
        } else {
          // If no data is returned but also no error (e.g., empty array)
          setCountries([]);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch country data';
        
        if (errorMessage.includes('not configured')) {
          setError('Supabase connection not configured. Please set up your Supabase credentials.');
        } else {
          setError(errorMessage);
        }
        
        captureException(err);
        console.error('Error fetching countries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
}
