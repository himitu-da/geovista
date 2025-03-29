
import React from 'react';
import { motion } from 'framer-motion';
import { CountryData } from '@/types/country';

interface CountryInfoOverlayProps {
  countries: CountryData[];
  selectedCountry: string | null;
  onCountrySelect: (countryId: string | null) => void;
}

const CountryInfoOverlay: React.FC<CountryInfoOverlayProps> = ({
  countries,
  selectedCountry,
  onCountrySelect
}) => {
  const country = countries.find(c => c.id === selectedCountry);
  
  if (!country) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute left-4 bottom-4 z-[400] bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-xs"
    >
      <h3 className="font-medium text-gray-800">
        {country.name}
      </h3>
      <button 
        onClick={() => onCountrySelect(null)}
        className="absolute top-1 right-1 text-gray-500 hover:text-gray-700 p-1"
      >
        ✕
      </button>
    </motion.div>
  );
};

export default CountryInfoOverlay;
