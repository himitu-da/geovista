
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageToggle: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };

  return (
    <button 
      className="bg-white rounded-md p-2 shadow-md text-gray-700 hover:bg-gray-100 flex items-center gap-1.5"
      onClick={toggleLanguage}
      aria-label={`Switch language to ${language === 'en' ? 'Spanish' : 'English'}`}
    >
      <Globe size={16} />
      <span className="text-xs font-medium">{language === 'en' ? 'Español' : 'English'}</span>
    </button>
  );
};

export default LanguageToggle;
