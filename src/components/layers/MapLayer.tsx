
import React from 'react';
import { motion } from 'framer-motion';
import WorldMap from '@/components/WorldMap';
import DataChart from '@/components/DataChart';
import { CountryData, DataMetric } from '@/types/country';
import { useIsMobile } from '@/hooks/use-mobile';

// アニメーション設定
const itemVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

/**
 * マップレイヤーコンポーネント
 * マップとそのコントロールを表示
 */
const MapLayer = ({ 
  countries, 
  loading, 
  selectedMetric, 
  selectedCountry, 
  onCountrySelect,
  visualizationType
}: {
  countries: CountryData[];
  loading: boolean;
  selectedMetric: DataMetric;
  selectedCountry: string | null;
  onCountrySelect: (countryId: string | null) => void;
  visualizationType: 'map' | 'chart';
}) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      className="absolute inset-0 z-0 scale-105 origin-center"
      variants={itemVariants}
    >
      {visualizationType === 'map' ? (
        <WorldMap 
          countries={countries} 
          loading={loading} 
          selectedMetric={selectedMetric}
          onCountrySelect={onCountrySelect}
          selectedCountry={selectedCountry}
        />
      ) : (
        <div className="h-full bg-gray-50 dark:bg-gray-900 p-2 sm:p-4">
          <DataChart 
            countries={countries}
            loading={loading}
            selectedMetric={selectedMetric}
            selectedCountry={selectedCountry}
          />
        </div>
      )}
    </motion.div>
  );
}

export default MapLayer;
