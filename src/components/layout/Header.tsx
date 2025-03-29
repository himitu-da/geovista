
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Globe, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center">
              <Globe className="h-6 w-6 text-blue-600 mr-2" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">World Data Explorer</h1>
            </Link>
            <motion.span 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-medium"
            >
              {t('explorer')}
            </motion.span>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-sm text-apple-gray-500">
              {t('globalDataVisualization')}
            </div>
            <Link to="/">
              <Button variant="outline" size="sm" className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Home className="h-4 w-4 mr-1" /> {t('home')}
              </Button>
            </Link>
            <LanguageToggle />
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="outline" 
              size="sm" 
              className="p-1.5"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              <div className="flex flex-col space-y-2 py-2">
                <div className="text-sm text-apple-gray-500 pb-2 text-center">
                  {t('globalDataVisualization')}
                </div>
                <Link to="/" className="w-full">
                  <Button variant="outline" size="sm" className="w-full justify-center rounded-full">
                    <Home className="h-4 w-4 mr-1" /> {t('home')}
                  </Button>
                </Link>
                <LanguageToggle />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
