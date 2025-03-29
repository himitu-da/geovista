
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { DataMetric } from '@/types/country';

interface SidebarVisualizationSectionProps {
  selectedMetric: DataMetric;
}

/**
 * 可視化タイプのセクション
 * データの凡例タイトルを表示
 */
const SidebarVisualizationSection: React.FC<SidebarVisualizationSectionProps> = ({
  selectedMetric
}) => {
  const { t } = useLanguage();
  
  // 選択されたメトリックに基づいてタイトルを取得
  const getMetricTitle = () => {
    switch (selectedMetric) {
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-2"
    >
      <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {getMetricTitle()}
      </h3>
    </motion.div>
  );
};

export default SidebarVisualizationSection;
