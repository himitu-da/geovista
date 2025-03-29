
import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountryData, DataMetric } from '@/types/country';
import { useIsMobile } from '@/hooks/use-mobile';

interface CountryTableRowProps {
  country: CountryData;
  selectedMetric: DataMetric;
  selectedCountry: string | null;
  onCountrySelect: (countryId: string | null) => void;
  formatMetricValue: (value: number | null, metric: string) => string;
  showMetricColumn?: boolean;
}

const CountryTableRow = ({
  country,
  selectedMetric,
  selectedCountry,
  onCountrySelect,
  formatMetricValue,
  showMetricColumn = true
}: CountryTableRowProps) => {
  const isMobile = useIsMobile();
  const isSelected = selectedCountry === country.id;
  
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 } 
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <motion.tr
      layout
      key={country.id}
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""}
    >
      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className="ml-1 sm:ml-2">
            <div className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{country.name}</div>
            <div className="text-[8px] sm:text-xs text-gray-500 dark:text-gray-400">{country.id.toUpperCase()}</div>
          </div>
        </div>
      </td>
      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
        <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100">
          {formatMetricValue(country.population, 'population')}
        </div>
      </td>
      {showMetricColumn && (
        <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
          <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100">
            {formatMetricValue(
              selectedMetric === 'population_density' 
                ? country.population_density 
                : selectedMetric === 'gdp_per_capita' 
                  ? country.gdp_per_capita 
                  : country.population,
              selectedMetric
            )}
          </div>
        </td>
      )}
      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
        <Button
          size={isMobile ? "sm" : "default"}
          variant={isSelected ? "default" : "ghost"}
          className="h-6 sm:h-8 py-0.5 sm:py-1 px-1.5 sm:px-3"
          onClick={() => onCountrySelect(isSelected ? null : country.id)}
        >
          <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1" />
          <span className="text-[8px] sm:text-xs">{isSelected ? "隠す" : "表示"}</span>
        </Button>
      </td>
    </motion.tr>
  );
};

export default CountryTableRow;
