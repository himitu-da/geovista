
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
  isInHeader?: boolean;
}

/**
 * シンプルなメトリック選択ドロップダウン
 */
const MetricDropdown: React.FC<MetricDropdownProps> = ({
  selectedMetric,
  onMetricChange,
  isInHeader = false
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
      <DropdownMenuTrigger className={`flex items-center gap-2 px-3 py-1.5 ${isInHeader ? 'bg-white w-full justify-center' : 'bg-white'} rounded-lg shadow-sm text-xs font-medium`}>
        {getMetricLabel(selectedMetric)}
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isInHeader ? "center" : "end"} 
        className="bg-white shadow-lg border-0" 
        sideOffset={5}
        style={{ 
          backgroundColor: 'white', 
          zIndex: 9999
        }}
      >
        <DropdownMenuItem onClick={() => onMetricChange('population_density')} className="hover:bg-gray-100 text-xs">
          {t('populationDensity')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMetricChange('population')} className="hover:bg-gray-100 text-xs">
          {t('totalPopulation')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMetricChange('gdp_per_capita')} className="hover:bg-gray-100 text-xs">
          {t('gdpPerCapita')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MetricDropdown;
