
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
        <CardContent className="p-3">
          <div className="flex p-1 bg-apple-gray-100 rounded-lg">
            <button 
              className={`flex items-center justify-center px-4 py-2.5 ${
                visualizationType === 'map' 
                  ? 'bg-white text-apple-gray-700 shadow-apple-sm'
                  : 'bg-transparent text-apple-gray-500'
              } rounded-md font-medium text-sm transition-all duration-200 flex-1`}
              onClick={() => onVisualizationTypeChange('map')}
              aria-pressed={visualizationType === 'map'}
            >
              <Map className="mr-2 h-4 w-4" />
              {t('map')}
            </button>
            <button 
              className={`flex items-center justify-center px-4 py-2.5 ${
                visualizationType === 'chart' 
                  ? 'bg-white text-apple-gray-700 shadow-apple-sm'
                  : 'bg-transparent text-apple-gray-500'
              } rounded-md font-medium text-sm transition-all duration-200 flex-1`}
              onClick={() => onVisualizationTypeChange('chart')}
              aria-pressed={visualizationType === 'chart'}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              {t('chart')}
            </button>
          </div>
        </CardContent>
      </Card>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Legend metric={selectedMetric} />
      </motion.div>
    </>
  );
};

export default SidebarVisualizationSection;
