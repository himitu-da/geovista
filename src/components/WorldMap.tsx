
import React, { useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CountryData } from '@/types/country';
import MapDataHandler from './map/MapDataHandler';
import L from 'leaflet';
import MapControls from './map/MapControls';
import LoadingOverlay from './map/LoadingOverlay';
import { initializeLeafletIcons } from './map/leafletUtils';
import MapPinManager from './map/MapPinManager';
import { useLanguage } from '@/contexts/LanguageContext';

// Initialize Leaflet default icons
initializeLeafletIcons();

/**
 * Map controller component - コントロールの改善
 */
function MapController({ setMapRef }: { setMapRef: React.Dispatch<React.SetStateAction<L.Map | null>> }) {
  const map = useMap();
  
  React.useEffect(() => {
    setMapRef(map);
    
    // Relax map constraints for free movement
    map.dragging.enable();
    map.touchZoom.enable();
    map.doubleClickZoom.enable();
    map.scrollWheelZoom.enable();
    map.boxZoom.enable();
    map.keyboard.enable();
    
    // Enable smooth zoom effect
    map.options.zoomSnap = 0.5;
    map.options.zoomDelta = 0.5;
    
    return () => {
      setMapRef(null);
    };
  }, [map, setMapRef]);
  
  return null;
}

interface WorldMapProps {
  countries: CountryData[];
  loading: boolean;
  onCountrySelect: (countryId: string | null) => void;
  selectedCountry: string | null;
}

/**
 * World map component - 改善版
 */
const WorldMap: React.FC<WorldMapProps> = ({ 
  countries, 
  loading, 
  onCountrySelect,
  selectedCountry 
}) => {
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const { language } = useLanguage();

  return (
    <div className="w-full h-full overflow-hidden relative">
      {/* Loading overlay */}
      {loading && <LoadingOverlay />}
      
      {/* Map controls */}
      <MapControls mapRef={mapRef} />
      
      {/* Full screen map */}
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        className="z-0"
        minZoom={1}
        maxZoom={10}
        worldCopyJump={true}
        attributionControl={false}
        scrollWheelZoom={true}
        dragging={true}
        touchZoom={true}
        doubleClickZoom={true}
      >
        {/* Map controller */}
        <MapController setMapRef={setMapRef} />
        
        {/* Map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Country data handler */}
        {!loading && countries.length > 0 && (
          <MapDataHandler
            countries={countries}
            selectedCountry={selectedCountry}
            onCountrySelect={onCountrySelect}
          />
        )}
        
        {/* Pin manager - add and manage pins on the map */}
        <MapPinManager />
      </MapContainer>
      
      {/* Attribution overlay */}
      <div className="absolute bottom-7 right-1 z-[400] text-[7px] sm:text-[8px] text-gray-700 bg-white/80 px-1.5 py-0.5 rounded-tl-md shadow-sm">
        &copy; <a href="https://www.openstreetmap.org/copyright" className="hover:text-blue-600 font-medium">OpenStreetMap</a>
      </div>
    </div>
  );
};

export default WorldMap;
