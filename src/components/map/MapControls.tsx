
import React from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Home, Search } from 'lucide-react';
import L from 'leaflet';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
      className="absolute bottom-2 right-2 z-[400] flex flex-col gap-0.5"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-md p-0.5 flex flex-col gap-0.5">
        {[
          { icon: Home, action: 'reset', title: 'homeView' },
          { icon: ZoomIn, action: 'zoomIn', title: 'zoomIn' },
          { icon: ZoomOut, action: 'zoomOut', title: 'zoomOut' },
        ].map((button, index) => (
          <button 
            key={index}
            onClick={() => handleMapAction(button.action as 'reset' | 'zoomIn' | 'zoomOut')}
            className={cn(
              "flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors",
              "w-4 h-4 sm:w-5 sm:h-5"
            )}
            title={t(button.title)}
          >
            <button.icon size={isMobile ? 10 : 12} />
          </button>
        ))}
      </div>
      
      <button 
        onClick={() => setShowSearch(!showSearch)}
        className={cn(
          "flex items-center justify-center rounded-full shadow-md transition-colors",
          "w-5 h-5 sm:w-6 sm:h-6",
          showSearch 
            ? "bg-blue-600 text-white hover:bg-blue-700" 
            : "bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        )}
        title={t('searchByCountry')}
      >
        <Search size={isMobile ? 10 : 12} />
      </button>
    </motion.div>
  );
};

export default MapControls;
