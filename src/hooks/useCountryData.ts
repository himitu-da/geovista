
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
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch country data';
        setError(errorMessage);
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
