
import React, { createContext, useState, useContext, ReactNode } from 'react';

type Language = 'en' | 'ja';

type Translations = {
  [key: string]: {
    en: string;
    ja: string;
  };
};

// Define all text translations here
export const translations: Translations = {
  loadingMapData: {
    en: "Loading map data...",
    ja: "地図データを読み込み中..."
  },
  searchCountry: {
    en: "Search for a country...",
    ja: "国名を検索..."
  },
  homeView: {
    en: "Home View",
    ja: "ホームビュー"
  },
  zoomIn: {
    en: "Zoom In",
    ja: "ズームイン"
  },
  zoomOut: {
    en: "Zoom Out",
    ja: "ズームアウト"
  },
  searchByCountry: {
    en: "Search by Country",
    ja: "国名で検索"
  },
  returnToHome: {
    en: "Return to Home",
    ja: "ホームに戻る"
  },
  navigation: {
    en: "Navigation",
    ja: "ナビゲーション"
  },
  visualizationType: {
    en: "Visualization Type",
    ja: "可視化タイプ"
  },
  dataMetrics: {
    en: "Data Metrics",
    ja: "データ指標"
  },
  aiInsights: {
    en: "AI Insights",
    ja: "AIインサイト"
  },
  information: {
    en: "Information",
    ja: "情報"
  },
  map: {
    en: "Map",
    ja: "マップ"
  },
  chart: {
    en: "Chart",
    ja: "チャート"
  },
  populationDensity: {
    en: "Population Density",
    ja: "人口密度"
  },
  totalPopulation: {
    en: "Total Population",
    ja: "総人口"
  },
  gdpPerCapita: {
    en: "GDP Per Capita",
    ja: "一人当たりGDP"
  },
  selectedCountry: {
    en: "Selected Country",
    ja: "選択された国"
  },
  population: {
    en: "Population",
    ja: "人口"
  },
  area: {
    en: "Area",
    ja: "面積"
  },
  aboutTheApp: {
    en: "This application is a tool for visually exploring data from countries around the world.",
    ja: "このアプリケーションは世界各国のデータを視覚的に探索するためのツールです。"
  },
  compareCountries: {
    en: "You can compare countries using various metrics and get AI-generated insights.",
    ja: "様々な指標で国を比較し、AIによる洞察を得ることができます。"
  },
  features: {
    en: "Features",
    ja: "機能"
  },
  mapView: {
    en: "Map View: Highlight countries geographically",
    ja: "マップビュー: 地理的に国をハイライト"
  },
  chartView: {
    en: "Chart View: Compare data from top 20 countries",
    ja: "チャートビュー: トップ20カ国のデータを比較"
  },
  aiInsightFeature: {
    en: "AI Insights: Generate insights from selected country data",
    ja: "AIインサイト: 選択した国のデータから洞察を生成"
  },
  enjoyExploring: {
    en: "Enjoy exploring the data",
    ja: "データ探索をお楽しみください"
  },
  globalDataVisualization: {
    en: "Interactive Global Data Visualization",
    ja: "インタラクティブなグローバルデータビジュアライゼーション"
  },
  home: {
    en: "Home",
    ja: "ホーム"
  },
  explorer: {
    en: "Explorer",
    ja: "エクスプローラー"
  },
  languageToggle: {
    en: "日本語",
    ja: "English"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en'); // Default language is English

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
