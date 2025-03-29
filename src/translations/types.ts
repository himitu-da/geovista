
// 言語タイプの定義
export type Language = 'en' | 'es' | 'ja';

// 翻訳のタイプ定義
export interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

// 単一の翻訳レコードの型
export type TranslationRecord = {
  [key in Language]: string;
};

// TranslationsMapの型定義
export type TranslationsMap = Record<string, TranslationRecord>;

// ランディングページのキーの型
export type LandingKey = 
  | 'launchExplorer'
  | 'dataVizPlatform'
  | 'exploreWorldData'
  | 'intuitively'
  | 'landingDescription'
  | 'startExploring'
  | 'viewFeatures'
  | 'scrollToExplore'
  | 'intuitiveDataViz'
  | 'powerfulTools'
  | 'interactiveMap'
  | 'interactiveMapDesc'
  | 'dataAnalysis'
  | 'dataAnalysisDesc'
  | 'demographicInsights'
  | 'demographicInsightsDesc'
  | 'simplifyComplexData'
  | 'designedFor'
  | 'feature1'
  | 'feature2'
  | 'feature3'
  | 'feature4'
  | 'worldwideData'
  | 'dataDashboard'
  | 'keyFeatures'
  | 'experienceFeatures'
  | 'demoPlaceholder'
  | 'launchExplorerNow'
  | 'readyToExplore'
  | 'startYourJourney'
  | 'globalDataVisualization'
  | 'allRightsReserved'
  | 'geographicalPatterns'
  | 'geographicalPatternsDesc'
  | 'globalExploration'
  | 'globalExplorationDesc';

// ランディングページの翻訳タイプ
export type LandingTranslations = {
  en: Record<LandingKey, string>;
  es: Record<LandingKey, string>;
  ja: Record<LandingKey, string>;
};
