
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Github, Twitter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md py-3 px-4 mt-auto border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-3 md:mb-0 flex items-center space-x-4">
            <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center space-x-1">
              <Home className="h-4 w-4" />
              <span>{t('returnToHome')}</span>
            </Link>
            <div className="flex items-center space-x-3">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Github className="h-4 w-4" />
              </a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-right">
            <p>World Data Explorer &copy; {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
