
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
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
      <form onSubmit={handleSearch} className="flex shadow-apple-md">
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchCountry')}
          className="py-2 px-3 text-sm rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent w-48 bg-white text-gray-800"
          aria-label={t('searchCountry')}
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white py-2 px-3 rounded-r-md hover:bg-blue-700 transition-colors"
          aria-label={t('search')}
        >
          <Search size={16} />
        </button>
      </form>
    </motion.div>
  );
};

export default SearchOverlay;
