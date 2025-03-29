
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
      "bg-white/80 backdrop-blur-sm rounded-full p-2 shadow-sm text-gray-700 transition-colors",
      isActive ? "text-blue-600 ring-2 ring-blue-400" : "hover:text-blue-600"
    )}
    title={title}
  >
    <Icon size={16} />
  </motion.button>
);

export default MapControls;
