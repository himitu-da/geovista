
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LandingFooter = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="bg-white py-12 border-t border-gray-100 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold text-apple-gray-700 mb-2 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              GeoVista
            </h3>
            <p className="text-apple-gray-500">{t('globalDataVisualization')}</p>
          </div>
          <div className="text-apple-gray-500">
            &copy; {new Date().getFullYear()} GeoVista | {t('allRightsReserved')}
          </div>
        </div>
      </div>
    </footer>
  );
};
