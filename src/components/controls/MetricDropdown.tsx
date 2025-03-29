
import React from 'react';
import { DataMetric } from '@/types/country';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface MetricDropdownProps {
  selectedMetric: DataMetric;
  onMetricChange: (metric: DataMetric) => void;
}

/**
 * シンプルなメトリック選択ドロップダウン
 */
const MetricDropdown: React.FC<MetricDropdownProps> = ({
  selectedMetric,
  onMetricChange
}) => {
  const { t } = useLanguage();
  
  // メトリックのラベルを取得
  const getMetricLabel = (metric: DataMetric): string => {
    switch (metric) {
      case 'population_density':
        return t('populationDensity');
      case 'population':
        return t('totalPopulation');
      case 'gdp_per_capita':
        return t('gdpPerCapita');
      default:
        return '';
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg shadow-md text-sm font-medium">
        {getMetricLabel(selectedMetric)}
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white shadow-lg border-0">
        <DropdownMenuItem onClick={() => onMetricChange('population_density')} className="hover:bg-gray-100">
          {t('populationDensity')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMetricChange('population')} className="hover:bg-gray-100">
          {t('totalPopulation')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMetricChange('gdp_per_capita')} className="hover:bg-gray-100">
          {t('gdpPerCapita')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MetricDropdown;
