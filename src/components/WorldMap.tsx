
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { CountryData, DataMetric } from '@/types/country';
import MapboxKeyForm from './map/MapboxKeyForm';
import MapDataHandler from './map/MapDataHandler';
import { initializeMap } from '@/utils/mapUtils';

interface WorldMapProps {
  countries: CountryData[];
  loading: boolean;
  selectedMetric: DataMetric;
  onCountrySelect: (countryId: string | null) => void;
  selectedCountry: string | null;
}

const WorldMap: React.FC<WorldMapProps> = ({ 
  countries, 
  loading, 
  selectedMetric,
  onCountrySelect,
  selectedCountry 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapKey, setMapKey] = useState<string>('');

  useEffect(() => {
    // Check if API key is stored in localStorage
    const storedMapKey = localStorage.getItem('mapbox_key');
    if (storedMapKey) {
      setMapKey(storedMapKey);
    }
  }, []);

  const handleKeySubmit = (newKey: string) => {
    localStorage.setItem('mapbox_key', newKey);
    setMapKey(newKey);
  };

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapKey || !mapContainer.current) return;
    
    if (map.current) return; // Initialize map only once
    
    map.current = initializeMap(mapContainer.current, mapKey);
    
    // Cleanup function
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [mapKey]);

  if (!mapKey) {
    return <MapboxKeyForm onKeySubmit={handleKeySubmit} />;
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-blue-500 font-medium">Loading map data...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* This component handles all data-related interactions with the map */}
      {map.current && !loading && countries.length > 0 && (
        <MapDataHandler
          map={map.current}
          countries={countries}
          selectedMetric={selectedMetric}
          selectedCountry={selectedCountry}
          onCountrySelect={onCountrySelect}
        />
      )}
    </div>
  );
};

export default WorldMap;
