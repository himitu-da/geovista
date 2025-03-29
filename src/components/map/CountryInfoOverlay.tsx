
import React from 'react';
import { motion } from 'framer-motion';
import { CountryData } from '@/types/country';
import { X } from 'lucide-react';

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
      className="absolute left-4 bottom-4 z-[400] bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-2.5 max-w-xs"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-medium text-sm text-gray-800">
          {country.name}
        </h3>
        <button 
          onClick={() => onCountrySelect(null)}
          className="text-gray-500 hover:text-gray-700 p-0.5 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>
      <div className="text-xs text-gray-600">
        {country.population && (
          <p>人口: {country.population.toLocaleString()}</p>
        )}
        {country.area_km2 && (
          <p>面積: {country.area_km2.toLocaleString()} km²</p>
        )}
      </div>
    </motion.div>
  );
};

export default CountryInfoOverlay;
