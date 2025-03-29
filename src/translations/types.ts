
// 言語タイプの定義
export type Language = 'en' | 'es' | 'ja';

// 翻訳のタイプ定義
export interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

// ランディングページの翻訳タイプ
export interface LandingTranslations {
  [key in Language]: {
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
    feature4: string;
    worldwideData: string;
    dataDashboard: string;
    keyFeatures: string;
    experienceFeatures: string;
    demoPlaceholder: string;
    launchExplorerNow: string;
    readyToExplore: string;
    startYourJourney: string;
    globalDataVisualization: string;
    allRightsReserved: string;
    geographicalPatterns: string;
    geographicalPatternsDesc: string;
    globalExploration: string;
    globalExplorationDesc: string;
  };
}
