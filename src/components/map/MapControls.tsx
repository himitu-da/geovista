
import React from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Home, Search } from 'lucide-react';
import L from 'leaflet';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

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

  // マップ操作関数
  const handleMapAction = (action: 'reset' | 'zoomIn' | 'zoomOut') => {
    if (!mapRef) return;
    
    switch (action) {
      case 'reset':
        mapRef.setView([20, 0], 2, { animate: true });
        break;
      case 'zoomIn':
        mapRef.zoomIn(1, { animate: true });
        break;
      case 'zoomOut':
        mapRef.zoomOut(1, { animate: true });
        break;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute bottom-6 right-6 z-[400] flex flex-col gap-2"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md p-1.5 flex flex-col gap-1.5">
        {[
          { icon: Home, action: 'reset', title: 'homeView' },
          { icon: ZoomIn, action: 'zoomIn', title: 'zoomIn' },
          { icon: ZoomOut, action: 'zoomOut', title: 'zoomOut' },
        ].map((button, index) => (
          <button 
            key={index}
            onClick={() => handleMapAction(button.action as 'reset' | 'zoomIn' | 'zoomOut')}
            className="w-9 h-9 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            title={t(button.title)}
          >
            <button.icon size={18} />
          </button>
        ))}
      </div>
      
      <button 
        onClick={() => setShowSearch(!showSearch)}
        className={cn(
          "w-12 h-12 flex items-center justify-center rounded-full shadow-md transition-colors",
          showSearch 
            ? "bg-blue-600 text-white hover:bg-blue-700" 
            : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        )}
        title={t('searchByCountry')}
      >
        <Search size={20} />
      </button>
    </motion.div>
  );
};

export default MapControls;
