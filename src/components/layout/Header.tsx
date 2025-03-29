
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
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md py-3 px-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">World Data Explorer</h1>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="sm" className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Home className="h-4 w-4 mr-1.5" /> {t('home')}
              </Button>
            </Link>
            <LanguageToggle />
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-1"
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
              className="md:hidden mt-3"
            >
              <div className="flex flex-col space-y-2 py-2">
                <Link to="/" className="w-full">
                  <Button variant="ghost" size="sm" className="w-full justify-center rounded-full">
                    <Home className="h-4 w-4 mr-1.5" /> {t('home')}
                  </Button>
                </Link>
                <div className="flex justify-center">
                  <LanguageToggle />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
