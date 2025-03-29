
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Github, Twitter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md h-5 sm:h-6 px-1 sm:px-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center space-x-1 sm:space-x-2 text-[8px] sm:text-xs">
        <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
          <Home className="h-2 w-2 sm:h-2.5 sm:w-2.5 mr-0.5" />
          <span className="hidden sm:inline text-[8px] sm:text-[10px]">{t('returnToHome')}</span>
        </Link>
        {!isMobile && (
          <div className="flex items-center space-x-1">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Github className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Twitter className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
            </a>
          </div>
        )}
      </div>
      <div className="text-[8px] sm:text-[10px] text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
