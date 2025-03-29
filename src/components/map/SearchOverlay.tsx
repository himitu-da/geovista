
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchOverlayProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  handleSearch: (e: React.FormEvent) => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch
}) => {
  const { t } = useLanguage();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-4 left-4 z-[400]"
    >
      <form onSubmit={handleSearch} className="flex">
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('searchCountry')}
          className="py-1.5 px-2.5 text-sm rounded-l-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent shadow-sm w-40"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white py-1.5 px-2.5 rounded-r-md hover:bg-blue-600 transition-colors"
        >
          <Search size={14} />
        </button>
      </form>
    </motion.div>
  );
};

export default SearchOverlay;
