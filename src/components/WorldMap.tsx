
import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CountryData, DataMetric } from '@/types/country';
import MapDataHandler from './map/MapDataHandler';
import L from 'leaflet';
import MapControls from './map/MapControls';
import SearchOverlay from './map/SearchOverlay';
import CountryInfoOverlay from './map/CountryInfoOverlay';
import LoadingOverlay from './map/LoadingOverlay';

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

// Map controller component to set the map reference
function MapController({ setMapRef }: { setMapRef: React.Dispatch<React.SetStateAction<L.Map | null>> }) {
  const map = useMap();
  
  React.useEffect(() => {
    setMapRef(map);
    return () => {
      setMapRef(null);
    };
  }, [map, setMapRef]);
  
  return null;
}

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
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Function to handle country search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim() || !countries.length) return;
    
    const searchLower = searchQuery.toLowerCase();
    const foundCountry = countries.find(country => 
      country.name.toLowerCase().includes(searchLower)
    );
    
    if (foundCountry) {
      onCountrySelect(foundCountry.id);
      
      if (mapRef && foundCountry.geometry && foundCountry.geometry.geometry) {
        try {
          // Create a GeoJSON object
          const geoJSON = L.geoJSON(foundCountry.geometry.geometry as any);
          
          // Get bounds and fit map to these bounds
          const bounds = geoJSON.getBounds();
          mapRef.fitBounds(bounds, { padding: [50, 50], maxZoom: 5, animate: true });
        } catch (error) {
          console.error('Error fitting bounds:', error);
        }
      }
    }
  };

  return (
    <div className="w-full h-full overflow-hidden">
      {/* Loading Overlay */}
      {loading && <LoadingOverlay />}
      
      {/* Map Controls */}
      <MapControls 
        mapRef={mapRef} 
        setShowSearch={setShowSearch} 
        showSearch={showSearch} 
      />
      
      {/* Search Overlay - コンパクト化 */}
      {showSearch && (
        <SearchOverlay 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
      )}
      
      {/* Selected Country Info Overlay - コンパクト化 */}
      {selectedCountry && countries.length > 0 && (
        <CountryInfoOverlay 
          countries={countries}
          selectedCountry={selectedCountry}
          onCountrySelect={onCountrySelect}
        />
      )}
      
      {/* Full screen map */}
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        className="z-0"
        minZoom={2}
        maxZoom={8}
        maxBounds={[[-90, -180], [90, 180]]}
        attributionControl={false}
      >
        {/* Map controller to get reference to the map */}
        <MapController setMapRef={setMapRef} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {!loading && countries.length > 0 && (
          <MapDataHandler
            countries={countries}
            selectedMetric={selectedMetric}
            selectedCountry={selectedCountry}
            onCountrySelect={onCountrySelect}
          />
        )}
      </MapContainer>
      
      {/* Attribution overlay in bottom right */}
      <div className="absolute bottom-0 right-0 z-[400] text-xs text-gray-500 bg-white/70 px-2 py-1 rounded-tl-md">
        &copy; <a href="https://www.openstreetmap.org/copyright" className="hover:text-blue-500">OpenStreetMap</a>
      </div>
    </div>
  );
};

export default WorldMap;
