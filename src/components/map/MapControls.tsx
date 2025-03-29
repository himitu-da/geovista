
import React from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Home, Search } from 'lucide-react';
import L from 'leaflet';
import { useLanguage } from '@/contexts/LanguageContext';

interface MapControlsProps {
  mapRef: L.Map | null;
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

const MapControls: React.FC<MapControlsProps> = ({ 
  mapRef, 
  showSearch, 
  setShowSearch 
}) => {
  const { t } = useLanguage();

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

  return (
    <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleResetView}
        className="bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-blue-600 transition-colors"
        title={t('homeView')}
      >
        <Home size={16} />
      </motion.button>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleZoomIn}
        className="bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-blue-600 transition-colors"
        title={t('zoomIn')}
      >
        <ZoomIn size={16} />
      </motion.button>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleZoomOut}
        className="bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-blue-600 transition-colors"
        title={t('zoomOut')}
      >
        <ZoomOut size={16} />
      </motion.button>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowSearch(!showSearch)}
        className="bg-white rounded-full p-2 shadow-md text-gray-700 hover:text-blue-600 transition-colors"
        title={t('searchByCountry')}
      >
        <Search size={16} />
      </motion.button>
    </div>
  );
};

export default MapControls;
