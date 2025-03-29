
import React from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchOverlayProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (e: React.FormEvent) => void;
}

/**
 * 地図上に表示される検索フォームオーバーレイ
 * 国名などの検索クエリ入力と検索実行の機能を提供
 */
const SearchOverlay: React.FC<SearchOverlayProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch
}) => {
  const { t } = useLanguage();
  
  // モーションアニメーションの設定
  const animationConfig = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  
  return (
    <motion.div 
      {...animationConfig}
      className="absolute top-4 left-4 z-[400]"
    >
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg p-1">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative flex-grow">
            <Search 
              size={18} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchCountry')}
              className="w-full py-2 pl-10 pr-3 text-sm rounded-l-md border-0 bg-transparent focus:outline-none focus:ring-0 text-gray-800 dark:text-gray-200"
              aria-label={t('searchCountry')}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button 
            type="submit" 
            className="bg-blue-600 text-white py-2 px-3 rounded-r-md hover:bg-blue-700 transition-colors"
            aria-label={t('search')}
          >
            <Search size={16} />
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default SearchOverlay;
