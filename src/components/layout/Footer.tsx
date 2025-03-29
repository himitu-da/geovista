
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md h-6 px-2 flex items-center justify-between border-t border-gray-100 z-[400]">
      <div className="flex items-center space-x-1 text-[9px]">
        <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
          <Home className="h-2.5 w-2.5 mr-0.5" />
          <span>{t('returnToHome')}</span>
        </Link>
      </div>
      <div className="text-[9px] text-gray-500">
        <p>© {new Date().getFullYear()} GeoVista</p>
      </div>
    </footer>
  );
};

export default Footer;
