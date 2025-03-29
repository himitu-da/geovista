
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CountryData, DataMetric } from '@/types/country';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CountryTableRowProps {
  country: CountryData;
  selectedMetric: DataMetric;
  selectedCountry: string | null;
  onCountrySelect: (countryId: string | null) => void;
  formatMetricValue: (country: CountryData, metric: DataMetric) => string;
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
  const { language } = useLanguage();
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

  // Calculate population density
  const getPopulationDensity = () => {
    if (!country.area_km2 || country.area_km2 === 0) return null;
    return country.population / country.area_km2;
  };

  const getMetricValue = (metric: DataMetric) => {
    switch (metric) {
      case 'population_density':
        return getPopulationDensity();
      case 'population':
        return country.population;
      case 'gdp_per_capita':
        return country.gdp_per_capita || null;
      default:
        return null;
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
      className={`${isSelected ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"} transition-colors`}
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
          {formatMetricValue(country, 'population')}
        </div>
      </td>
      {showMetricColumn && (
        <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
          <div className="text-xs sm:text-sm text-gray-900 dark:text-gray-100">
            {formatMetricValue(country, selectedMetric)}
          </div>
        </td>
      )}
      <td className="px-2 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant={isSelected ? "default" : "ghost"}
                className={`h-6 sm:h-7 py-0.5 sm:py-1 px-2 sm:px-3 ${isSelected ? "" : "border border-gray-200 dark:border-gray-700"}`}
                onClick={() => onCountrySelect(isSelected ? null : country.id)}
              >
                {isSelected ? (
                  <EyeOff className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1" />
                ) : (
                  <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-0.5 sm:mr-1" />
                )}
                <span className="text-[8px] sm:text-xs">
                  {isSelected 
                    ? (language === 'es' ? 'Ocultar' : 'Hide') 
                    : (language === 'es' ? 'Mostrar' : 'Show')}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {isSelected 
                ? (language === 'es' ? 'Ocultar país' : 'Hide country') 
                : (language === 'es' ? 'Mostrar país en el mapa' : 'Show country on map')}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </td>
    </motion.tr>
  );
};

export default CountryTableRow;
