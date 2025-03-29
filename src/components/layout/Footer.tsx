
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Github, Twitter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md h-8 px-2 flex items-center justify-between border-t border-gray-100 dark:border-gray-800">
      <div className="flex items-center space-x-3 text-xs">
        <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
          <Home className="h-3 w-3 mr-1" />
          <span className="hidden sm:inline">{t('returnToHome')}</span>
        </Link>
        <div className="flex items-center space-x-2">
          <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <Github className="h-3 w-3" />
          </a>
          <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <Twitter className="h-3 w-3" />
          </a>
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

export default Footer;
