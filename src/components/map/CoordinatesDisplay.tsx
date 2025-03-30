// src/components/map/CoordinatesDisplay.tsx
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface CoordinatesDisplayProps {
  position: [number, number];
  className?: string;
}

/**
 * A component to display geographic coordinates in a clean, formatted way
 */
const CoordinatesDisplay: React.FC<CoordinatesDisplayProps> = ({ 
  position, 
  className = ''
}) => {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      className={`text-xs bg-gray-50 p-2 rounded-md border border-gray-200 shadow-sm ${className}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-2 gap-2">
        <div>
          {t('latitude')}: 
          <span className="font-medium ml-1">{position[0].toFixed(4)}</span>
        </div>
        <div>
          {t('longitude')}: 
          <span className="font-medium ml-1">{position[1].toFixed(4)}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CoordinatesDisplay;