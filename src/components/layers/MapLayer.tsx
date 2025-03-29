
import React from 'react';
import { motion } from 'framer-motion';
import WorldMap from '@/components/WorldMap';
import Footer from '@/components/layout/Footer';
import { CountryData, DataMetric } from '@/types/country';

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
 * マップとレジェンドを表示
 */
const MapLayer = ({ 
  countries, 
  loading, 
  selectedMetric, 
  selectedCountry, 
  onCountrySelect
}: {
  countries: CountryData[];
  loading: boolean;
  selectedMetric: DataMetric;
  selectedCountry: string | null;
  onCountrySelect: (countryId: string | null) => void;
}) => {
  return (
    <motion.div 
      className="absolute inset-0 z-0"
      variants={itemVariants}
    >
      <WorldMap 
        countries={countries} 
        loading={loading} 
        selectedMetric={selectedMetric}
        onCountrySelect={onCountrySelect}
        selectedCountry={selectedCountry}
      />
      <Footer />
    </motion.div>
  );
}

export default MapLayer;
