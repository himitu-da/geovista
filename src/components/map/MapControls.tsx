
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
      className="absolute top-20 right-4 z-[400] flex flex-col gap-1.5"
    >
      {/* マップコントロールボタン群 */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-md p-1 border border-gray-200 dark:border-gray-700">
        {[
          { icon: Home, action: 'reset', title: 'homeView' },
          { icon: ZoomIn, action: 'zoomIn', title: 'zoomIn' },
          { icon: ZoomOut, action: 'zoomOut', title: 'zoomOut' },
          { icon: Search, action: 'search', title: 'searchByCountry', isActive: showSearch }
        ].map((button, index) => (
          <ControlButton 
            key={index}
            Icon={button.icon}
            onClick={() => {
              if (button.action === 'search') {
                setShowSearch(!showSearch);
              } else {
                handleMapAction(button.action as 'reset' | 'zoomIn' | 'zoomOut');
              }
            }}
            title={t(button.title)}
            isActive={button.isActive}
          />
        ))}
      </div>
    </motion.div>
  );
};

// コントロールボタンコンポーネント
interface ControlButtonProps {
  Icon: React.FC<any>;
  onClick: () => void;
  title: string;
  isActive?: boolean;
}

const ControlButton: React.FC<ControlButtonProps> = ({ Icon, onClick, title, isActive }) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "rounded-md p-2 text-gray-700 dark:text-gray-300 transition-colors block",
      isActive 
        ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30" 
        : "hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
    )}
    title={title}
  >
    <Icon size={16} />
  </motion.button>
);

export default MapControls;
