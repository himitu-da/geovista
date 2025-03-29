
import React, { useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { CountryData, DataMetric } from '@/types/country';
import MapDataHandler from './map/MapDataHandler';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { Search, ZoomIn, ZoomOut, Maximize, Home } from 'lucide-react';

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
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  // Function to reset map view
  const handleResetView = () => {
    if (mapRef) {
      mapRef.setView([20, 0], 2, { animate: true });
    }
  };

  // Function to zoom in
  const handleZoomIn = () => {
    if (mapRef) {
      mapRef.zoomIn(1, { animate: true });
    }
  };

  // Function to zoom out
  const handleZoomOut = () => {
    if (mapRef) {
      mapRef.zoomOut(1, { animate: true });
    }
  };

  // Function to search for a country
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
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-gray-100 shadow-apple-md bg-white">
      {loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 backdrop-blur-sm z-[1000]"
        >
          <motion.div 
            className="flex flex-col items-center"
            animate={{ scale: [0.95, 1, 0.95] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="h-10 w-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-3"></div>
            <p className="text-apple-gray-600 font-medium tracking-tight">地図データを読み込み中...</p>
          </motion.div>
        </motion.div>
      )}
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleResetView}
          className="bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-blue-600 transition-colors"
          title="ホームビュー"
        >
          <Home size={16} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomIn}
          className="bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-blue-600 transition-colors"
          title="ズームイン"
        >
          <ZoomIn size={16} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleZoomOut}
          className="bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-blue-600 transition-colors"
          title="ズームアウト"
        >
          <ZoomOut size={16} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSearch(!showSearch)}
          className="bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-blue-600 transition-colors"
          title="国名で検索"
        >
          <Search size={16} />
        </motion.button>
      </div>
      
      {/* Search Input */}
      {showSearch && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-4 left-4 z-[400]"
        >
          <form onSubmit={handleSearch} className="flex">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="国名を検索..."
              className="py-2 px-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <button 
              type="submit" 
              className="bg-blue-500 text-white py-2 px-3 rounded-r-lg hover:bg-blue-600 transition-colors"
            >
              <Search size={16} />
            </button>
          </form>
        </motion.div>
      )}
      
      {/* Selected Country Overlay */}
      {selectedCountry && countries.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute left-4 bottom-4 z-[400] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-xs"
        >
          <h3 className="font-medium text-gray-800">
            {countries.find(c => c.id === selectedCountry)?.name}
          </h3>
          <button 
            onClick={() => onCountrySelect(null)}
            className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 p-1"
          >
            ✕
          </button>
        </motion.div>
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
        whenCreated={setMapRef}
      >
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
    </div>
  );
};

export default WorldMap;
