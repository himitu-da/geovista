
import React from 'react';
import { Map, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import Legend from '@/components/Legend';
import { useLanguage } from '@/contexts/LanguageContext';
import { DataMetric } from '@/types/country';

interface SidebarVisualizationSectionProps {
  visualizationType: 'map' | 'chart';
  selectedMetric: DataMetric;
  onVisualizationTypeChange: (type: 'map' | 'chart') => void;
}

/**
 * 可視化タイプの選択セクション
 * マップビューとチャートビューの切り替えとデータの凡例を表示
 */
const SidebarVisualizationSection: React.FC<SidebarVisualizationSectionProps> = ({
  visualizationType,
  selectedMetric,
  onVisualizationTypeChange
}) => {
  const { t } = useLanguage();
  
  return (
    <>
      <Card className="border-none shadow-none">
        <CardContent className="p-1">
          <div className="flex p-0.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button 
              className={`flex items-center justify-center px-2 py-1 ${
                visualizationType === 'map' 
                  ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm'
                  : 'bg-transparent text-gray-600 dark:text-gray-300'
              } rounded-md font-medium text-xs transition-all duration-200 flex-1`}
              onClick={() => onVisualizationTypeChange('map')}
              aria-pressed={visualizationType === 'map'}
            >
              <Map className="mr-1 h-3 w-3" />
              {t('map')}
            </button>
            <button 
              className={`flex items-center justify-center px-2 py-1 ${
                visualizationType === 'chart' 
                  ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm'
                  : 'bg-transparent text-gray-600 dark:text-gray-300'
              } rounded-md font-medium text-xs transition-all duration-200 flex-1`}
              onClick={() => onVisualizationTypeChange('chart')}
              aria-pressed={visualizationType === 'chart'}
            >
              <BarChart3 className="mr-1 h-3 w-3" />
              {t('chart')}
            </button>
          </div>
        </CardContent>
      </Card>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="scale-95 origin-top-left"
      >
        <Legend metric={selectedMetric} />
      </motion.div>
    </>
  );
};

export default SidebarVisualizationSection;
