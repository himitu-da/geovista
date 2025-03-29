
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ja' : 'en');
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="rounded-full flex items-center gap-1.5 hover:bg-blue-50 hover:text-blue-600 transition-colors"
      onClick={toggleLanguage}
      aria-label={`Switch language to ${language === 'en' ? 'Japanese' : 'English'}`}
    >
      <Globe className="h-4 w-4" />
      <span>{t('languageToggle')}</span>
    </Button>
  );
};

export default LanguageToggle;
