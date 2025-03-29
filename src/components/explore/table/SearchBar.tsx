
import React from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <div className="p-2 sm:p-4 border-b">
      <div className="relative">
        <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
        <input
          type="text"
          placeholder={t('searchCountries')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 sm:pl-10 pr-2 sm:pr-4 py-1 sm:py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
          aria-label={t('searchCountries')}
        />
      </div>
    </div>
  );
};

export default SearchBar;
