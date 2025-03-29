
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
      icon: <Layers className="h-5 w-5" />,
      label: t('overview')
    },
    {
      id: 'geography',
      icon: <Globe className="h-5 w-5" />,
      label: t('geography')
    },
    {
      id: 'demographics',
      icon: <Users className="h-5 w-5" />,
      label: t('demographics')
    },
    {
      id: 'economy',
      icon: <TrendingUp className="h-5 w-5" />,
      label: t('economy')
    }
  ];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 dark:divide-gray-700">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`flex items-center justify-center space-x-2 px-3 py-3 text-sm transition-colors ${
              activeCategory === category.id
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <div className={`${activeCategory === category.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {category.icon}
            </div>
            <span className="font-medium">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataCategoryNav;
