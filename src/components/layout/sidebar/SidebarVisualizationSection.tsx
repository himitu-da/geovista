
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
      <div className="px-3 py-2">
        <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button 
            className={`flex items-center justify-center px-4 py-2 ${
              visualizationType === 'map' 
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'bg-transparent text-gray-600 dark:text-gray-400'
            } rounded-md font-medium text-sm transition-all duration-200 flex-1`}
            onClick={() => onVisualizationTypeChange('map')}
            aria-pressed={visualizationType === 'map'}
          >
            <Map className="mr-2 h-4 w-4" />
            {t('map')}
          </button>
          <button 
            className={`flex items-center justify-center px-4 py-2 ${
              visualizationType === 'chart' 
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'bg-transparent text-gray-600 dark:text-gray-400'
            } rounded-md font-medium text-sm transition-all duration-200 flex-1`}
            onClick={() => onVisualizationTypeChange('chart')}
            aria-pressed={visualizationType === 'chart'}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            {t('chart')}
          </button>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-3 py-2"
      >
        <Legend metric={selectedMetric} />
      </motion.div>
    </>
  );
};

export default SidebarVisualizationSection;
