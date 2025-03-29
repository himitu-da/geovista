
import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Globe, TrendingUp, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export type DataCategory = 'geography' | 'demographics' | 'economy' | 'overview';

interface DataCategoryNavProps {
  activeCategory: DataCategory;
  onCategoryChange: (category: DataCategory) => void;
}

const DataCategoryNav: React.FC<DataCategoryNavProps> = ({
  activeCategory,
  onCategoryChange
}) => {
  const { t } = useLanguage();
  
  const categories: {
    id: DataCategory;
    icon: React.ReactNode;
    label: string;
  }[] = [
    {
      id: 'overview',
      icon: <Layers className="h-4 w-4" />,
      label: t('overview')
    },
    {
      id: 'geography',
      icon: <Globe className="h-4 w-4" />,
      label: t('geography')
    },
    {
      id: 'demographics',
      icon: <Users className="h-4 w-4" />,
      label: t('demographics')
    },
    {
      id: 'economy',
      icon: <TrendingUp className="h-4 w-4" />,
      label: t('economy')
    }
  ];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`flex items-center space-x-3 px-4 py-2.5 text-sm transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <div className={`${activeCategory === category.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {category.icon}
            </div>
            <span className="font-medium">{category.label}</span>
            {activeCategory === category.id && (
              <motion.div
                layoutId="category-indicator"
                className="ml-auto h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.4 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataCategoryNav;
