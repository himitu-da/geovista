// src/hooks/useCountryData.ts
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
        
        // Supabaseから国データを取得
        const { data, error } = await supabase
          .from('countries')
          .select('*');

        if (error) {
          throw error;
        }

        if (data) {
          // データを適切な形式に変換
          const formattedData = data.map((item: any) => {
            // geometryがJSON文字列として格納されている場合、パースする
            let geometry = item.geometry;
            if (typeof geometry === 'string') {
              try {
                geometry = JSON.parse(geometry);
              } catch (e) {
                console.error('Error parsing geometry:', e);
                // パースに失敗した場合は空のオブジェクトを使用
                geometry = { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [] } };
              }
            }
            
            // 人口密度の計算
            const populationDensity = item.area_km2 && item.area_km2 > 0 
              ? item.population / item.area_km2 
              : null;
            
            return {
              ...item,
              geometry,
              population_density: populationDensity
            } as CountryData;
          });
          
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