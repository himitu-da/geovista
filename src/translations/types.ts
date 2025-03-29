
export type TranslationRecord = {
  en: string;
  es: string;
};

export type TranslationsMap = Record<string, TranslationRecord>;

export type Language = 'en' | 'es';

export interface LandingTranslations {
  en: {
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
  es: {
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
