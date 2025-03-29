
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { ButtonAnimation } from '@/components/animations/ButtonAnimation';

export const LandingHeader = () => {
  const { t } = useLanguage();
  
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight text-apple-gray-700 bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
          GeoVista
        </h1>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link to="/explore">
            <ButtonAnimation>
              <Button variant="outline" className="flex items-center gap-2 rounded-full hover:bg-primary hover:text-white transition-all border-blue-200">
                {t('launchExplorer')} <ArrowRight className="h-4 w-4" />
              </Button>
            </ButtonAnimation>
          </Link>
        </div>
      </div>
    </header>
  );
};
