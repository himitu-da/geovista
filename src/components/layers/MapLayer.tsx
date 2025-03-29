
import React from 'react';
import { motion } from 'framer-motion';
import WorldMap from '@/components/WorldMap';
import Footer from '@/components/layout/Footer';
import { CountryData } from '@/types/country';
import { useLanguage } from '@/contexts/LanguageContext';

// アニメーション設定
const itemVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
  }
};

/**
 * マップレイヤーコンポーネント - シンプル化バージョン
 */
const MapLayer = ({ 
  countries, 
  loading, 
  selectedCountry, 
  onCountrySelect
}: {
  countries: CountryData[];
  loading: boolean;
  selectedCountry: string | null;
  onCountrySelect: (countryId: string | null) => void;
}) => {
  // Ensure the language context is present
  const { language } = useLanguage();
  
  return (
    <motion.div 
      className="absolute inset-0 z-0"
      variants={itemVariants}
    >
      <WorldMap 
        countries={countries} 
        loading={loading} 
        onCountrySelect={onCountrySelect}
        selectedCountry={selectedCountry}
      />
      <Footer />
    </motion.div>
  );
}

export default MapLayer;
