// src/components/map/PinDistanceDisplay.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Ruler, ArrowLeftRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';

interface PinDistanceDisplayProps {
  distances: {
    fromPin: number;
    toPin: number;
    distance: number;
    bearing: number;
  }[];
}

/**
 * Component that displays distances between multiple pins
 */
const PinDistanceDisplay: React.FC<PinDistanceDisplayProps> = ({ distances }) => {
  const { t, language } = useLanguage();
  
  if (!distances.length) return null;
  
  // Format distance based on length (m vs km)
  const formatDistance = (meters: number): string => {
    if (meters >= 1000) {
      return `${(meters / 1000).toFixed(2)} km`;
    }
    return `${Math.round(meters)} m`;
  };
  
  // Get cardinal direction from bearing
  const getCardinalDirection = (bearing: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW', 'N'];
    return directions[Math.round(bearing / 45)];
  };
  
  return (
    <motion.div
      className="absolute z-50 bottom-16 left-4 max-w-xs"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2 pb-1 border-b border-gray-200">
            <Ruler className="h-4 w-4 text-blue-500" />
            <h3 className="text-xs font-medium text-gray-900">
              {language === 'es' ? 'Distancias entre pines' : 'Distances between pins'}
            </h3>
          </div>
          
          <ul className="space-y-2">
            {distances.map((item, index) => (
              <motion.li 
                key={`distance-${index}`}
                className="text-xs grid grid-cols-[auto,1fr] gap-x-2 items-center"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <span className="font-medium text-gray-600">
                    {language === 'es' ? 'Pin' : 'Pin'} {item.fromPin + 1} → {item.toPin + 1}:
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-blue-600">
                    {formatDistance(item.distance)}
                  </span>
                  <ArrowLeftRight className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-500">
                    {getCardinalDirection(item.bearing)} ({Math.round(item.bearing)}°)
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PinDistanceDisplay;