// ��語タイプ
export type Language = 'en' | 'ja';

// 翻訳レコード型
export type TranslationRecord = {
  en: string;
  ja: string;
};

// 翻訳全体のマップ型
export type TranslationsMap = Record<string, TranslationRecord>;

export interface LandingTranslations {
  [key: string]: {
    launchExplorer: string;
    dataVizPlatform: string;
    exploreWorldData: string;
    intuitively: string;
    landingDescription: string;
    startExploring: string;
    viewFeatures: string;
    scrollToExplore: string;
    intuitiveDataViz: string;
    powerfulTools: string;
    interactiveMap: string;
    interactiveMapDesc: string;
    dataAnalysis: string;
    dataAnalysisDesc: string;
    demographicInsights: string;
    demographicInsightsDesc: string;
    simplifyComplexData: string;
    designedFor: string;
    feature1: string;
    feature2: string;
    feature3: string;
    dataDashboard: string;
    keyFeatures: string;
    experienceFeatures: string;
    demoPlaceholder: string;
    launchExplorerNow: string;
    readyToExplore: string;
    startYourJourney: string;
    globalDataVisualization: string;
    allRightsReserved: string;
  }
}
