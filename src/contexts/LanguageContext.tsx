
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Language, TranslationsMap } from '@/translations/types';
import { translations } from '@/translations';

// LanguageContextの型定義
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = 'preferred_language';

// LanguageContextを作成
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get initial language from browser settings or local storage
  const getBrowserLanguage = (): Language => {
    // Get from local storage first
    const savedLanguage = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      return savedLanguage;
    }
    
    // Check browser language
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    return browserLang === 'es' ? 'es' : 'en'; // Spanish or default to English
  };

  const [language, setLanguage] = useState<Language>('en'); // Default is English

  // Initialize with browser language on load
  useEffect(() => {
    setLanguage(getBrowserLanguage());
  }, []);

  // Save language preference to localStorage when changed
  const handleSetLanguage = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Export translations and Language type
export { translations };
export type { Language };
