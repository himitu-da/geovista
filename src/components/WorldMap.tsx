
import React from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CountryData, DataMetric } from '@/types/country';
import MapDataHandler from './map/MapDataHandler';
import L from 'leaflet';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Initialize default Leaflet icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

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
  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-gray-100 shadow-apple-md bg-white">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm z-[1000]">
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
            <p className="text-apple-gray-600 font-medium tracking-tight">地図データを読み込み中...</p>
          </div>
        </div>
      )}
      
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        className="z-0"
        minZoom={2}
        maxZoom={8}
        maxBounds={[[-90, -180], [90, 180]]}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <ZoomControl position="topright" />
        
        {!loading && countries.length > 0 && (
          <MapDataHandler
            countries={countries}
            selectedMetric={selectedMetric}
            selectedCountry={selectedCountry}
            onCountrySelect={onCountrySelect}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default WorldMap;
