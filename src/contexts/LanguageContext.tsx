
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
  // ブラウザの言語設定から初期値を取得するロジック
  const getBrowserLanguage = (): Language => {
    // ローカルストレージから言語設定を取得
    const savedLanguage = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ja')) {
      return savedLanguage;
    }
    
    // ブラウザの言語設定を確認
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    return browserLang === 'ja' ? 'ja' : 'en'; // jaならja、それ以外はen
  };

  const [language, setLanguage] = useState<Language>('en'); // デフォルトは英語

  // 初期化時にブラウザの言語を取得
  useEffect(() => {
    setLanguage(getBrowserLanguage());
  }, []);

  // 言語変更時にローカルストレージに保存
  const handleSetLanguage = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  // 翻訳関数
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

// 言語コンテキストを使用するためのカスタムフック
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// 翻訳データをエクスポート（コンポーネントから直接アクセスできるように）
export { translations };
export type { Language };
