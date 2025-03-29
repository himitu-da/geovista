
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
  },
  // Landing page translations
  launchExplorer: {
    en: "Launch Explorer",
    ja: "エクスプローラーを起動"
  },
  dataVizPlatform: {
    en: "Data Visualization Platform",
    ja: "データビジュアライゼーション・プラットフォーム"
  },
  exploreWorldData: {
    en: "Explore World Data",
    ja: "世界のデータを"
  },
  intuitively: {
    en: "Intuitively",
    ja: "直感的に探索する"
  },
  landingDescription: {
    en: "Interactive visualization of diverse global data including demographics and economic indicators. Discover patterns and insights from a global perspective.",
    ja: "人口統計、経済指標など、世界の多様なデータをインタラクティブに可視化。グローバルな視点からパターンや洞察を発見しましょう。"
  },
  startExploring: {
    en: "Start Exploring Now",
    ja: "今すぐ探索を始める"
  },
  viewFeatures: {
    en: "View Features",
    ja: "機能を見る"
  },
  intuitiveDataViz: {
    en: "Intuitive Data Visualization",
    ja: "直感的なデータビジュアライゼーション"
  },
  powerfulTools: {
    en: "Powerful tools to easily understand and analyze complex global data",
    ja: "複雑なグローバルデータを簡単に理解し、分析するための強力なツール"
  },
  interactiveMap: {
    en: "Interactive Map",
    ja: "インタラクティブマップ"
  },
  interactiveMapDesc: {
    en: "Explore with an interactive world map featuring color-coded metrics and detailed country information.",
    ja: "カラーコード化されたメトリクスと詳細な国別情報を備えたインタラクティブな世界地図で探索できます。"
  },
  dataAnalysis: {
    en: "Data Analysis",
    ja: "データ分析"
  },
  dataAnalysisDesc: {
    en: "Analyze trends with interactive charts that reveal patterns and comparative insights.",
    ja: "パターンや比較洞察を明らかにするインタラクティブなチャートでトレンドを分析できます。"
  },
  demographicInsights: {
    en: "Demographic Insights",
    ja: "人口統計インサイト"
  },
  demographicInsightsDesc: {
    en: "Understand global demographics through detailed population density and distribution data.",
    ja: "詳細な人口密度および分布データにより、世界の人口統計を理解できます。"
  },
  simplifyComplexData: {
    en: "Simplify Complex Data Visualization",
    ja: "複雑なデータをシンプルに可視化"
  },
  designedFor: {
    en: "World Data Explorer is designed to make global datasets intuitively understandable. Ideal for researchers, educators, and data enthusiasts.",
    ja: "World Data Explorerは、世界規模のデータセットを直感的に理解できるように設計されています。研究者、教育者、データ愛好家の方々に最適なツールです。"
  },
  feature1: {
    en: "Data covering over 200 countries and territories",
    ja: "200以上の国と地域のデータを網羅"
  },
  feature2: {
    en: "Switch between multiple datasets and metrics",
    ja: "複数のデータセットと指標を切り替え可能"
  },
  feature3: {
    en: "Advanced data analysis powered by AI",
    ja: "AIを活用した高度なデータ分析"
  },
  dataDashboard: {
    en: "Data Analysis Dashboard",
    ja: "データ分析ダッシュボード"
  },
  keyFeatures: {
    en: "Key Features",
    ja: "主要機能"
  },
  experienceFeatures: {
    en: "Experience the ease of use and functionality of World Data Explorer",
    ja: "World Data Explorerの使いやすさと機能性をご覧ください"
  },
  demoPlaceholder: {
    en: "Place demo video or image here",
    ja: "デモ映像や画像をここに配置"
  },
  launchExplorerNow: {
    en: "Launch Explorer Now",
    ja: "今すぐエクスプローラーを起動"
  },
  readyToExplore: {
    en: "Ready to Start Exploring?",
    ja: "探索を始めませんか？"
  },
  startYourJourney: {
    en: "Start your journey to visualize world data and discover global insights today.",
    ja: "世界のデータを視覚化し、グローバルな洞察を発見する旅を今すぐ始めましょう。"
  },
  launchExplorer: {
    en: "Launch Explorer",
    ja: "エクスプローラーを起動"
  },
  allRightsReserved: {
    en: "All Rights Reserved",
    ja: "全ての権利を保有"
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
