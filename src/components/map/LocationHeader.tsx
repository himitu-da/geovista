// src/components/map/LocationHeader.tsx
import React from 'react';
import { MapPin, MapPinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface LocationHeaderProps {
  onRemove: () => void;
}

/**
 * Header component for location popup displaying title and remove button
 */
const LocationHeader: React.FC<LocationHeaderProps> = ({ onRemove }) => {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      className="flex justify-between items-center mb-3 border-b pb-2"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="text-sm font-medium flex items-center">
        <MapPin className="w-4 h-4 mr-1.5 text-red-500" />
        {t('selectedLocation')}
      </h3>
      <Button 
        variant="ghost"
        size="sm"
        className="h-6 px-1.5 py-0 flex items-center gap-1 text-xs hover:bg-red-50 hover:text-red-600 text-red-500"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <MapPinOff className="h-3 w-3" />
        {t('remove')}
      </Button>
    </motion.div>
  );
};

export default LocationHeader;