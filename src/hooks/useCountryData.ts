
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
        
        // Supabaseから国データを取得
        const { data, error } = await supabase
          .from('countries')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          // データを適切な形式に変換
          const formattedData = data.map(item => ({
            id: item.id,
            name: item.name,
            code: item.code,
            population: item.population,
            area_km2: item.area_km2,
            gdp_per_capita: item.gdp_per_capita,
            // GeoJSONの形式に変換
            geometry: item.geometry as unknown as GeoJSON.Feature
          }));
          
          setCountries(formattedData);
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
