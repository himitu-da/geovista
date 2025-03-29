
import React from 'react';
import { Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { CountryData, DataMetric } from '@/types/country';
import { useLanguage } from '@/contexts/LanguageContext';

interface CountryTableRowProps {
  country: CountryData;
  selectedMetric: DataMetric;
  selectedCountry: string | null;
  onCountrySelect: (countryId: string | null) => void;
  formatMetricValue: (country: CountryData, metric: DataMetric) => string;
}

const CountryTableRow: React.FC<CountryTableRowProps> = ({
  country,
  selectedMetric,
  selectedCountry,
  onCountrySelect,
  formatMetricValue
}) => {
  const { t } = useLanguage();
  
  return (
    <motion.tr 
      key={country.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`hover:bg-gray-50 ${selectedCountry === country.id ? 'bg-blue-50' : ''}`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="text-sm font-medium text-gray-900">
            {country.name}
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {country.population.toLocaleString()} 人
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatMetricValue(country, selectedMetric)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onCountrySelect(selectedCountry === country.id ? null : country.id)}
          className={`inline-flex items-center py-1 px-2 border rounded-md text-xs font-medium ${
            selectedCountry === country.id
              ? 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Map className="mr-1 h-3 w-3" />
          {selectedCountry === country.id ? t('viewing') : t('viewOnMap')}
        </button>
      </td>
    </motion.tr>
  );
};

export default CountryTableRow;
