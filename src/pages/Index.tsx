
import React, { useEffect, useState } from 'react';
import WorldMap from '@/components/WorldMap';
import { useCountryData } from '@/hooks/useCountryData';
import { initializeSentry } from '@/lib/sentry';
import { DataMetric } from '@/types/country';
import { motion } from 'framer-motion';
import { SidebarProvider } from '@/components/ui/sidebar';
import ExplorerSidebar from '@/components/layout/ExplorerSidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ErrorMessage from '@/components/ErrorMessage';
import DataChart from '@/components/DataChart';
import CountryDataTable from '@/components/explore/CountryDataTable';
import DataCategoryNav, { DataCategory } from '@/components/explore/DataCategoryNav';
import FeaturedInsights from '@/components/explore/FeaturedInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';

// アニメーション設定
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.5,
      staggerChildren: 0.1 
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

/**
 * インデックスページコンポーネント
 * アプリケーションのメインページとして機能し、地図とコントロールを表示
 */
const Index = () => {
  const { t } = useLanguage();
  
  // Sentryの初期化
  useEffect(() => {
    initializeSentry();
  }, []);

  // UIの状態
  const [visualizationType, setVisualizationType] = useState<'map' | 'chart'>('map');
  const [selectedMetric, setSelectedMetric] = useState<DataMetric>('population_density');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<DataCategory>('overview');
  const [activeTab, setActiveTab] = useState<string>('map');

  // 国データのフェッチ
  const { countries, loading, error } = useCountryData();

  return (
    <motion.div 
      className="fixed inset-0 w-screen h-screen overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* エラーメッセージ */}
      <ErrorMessage error={error} />
      
      {/* ベースレイヤーとしてのフルスクリーンマップ */}
      <MapLayer 
        countries={countries} 
        loading={loading} 
        selectedMetric={selectedMetric}
        selectedCountry={selectedCountry}
        onCountrySelect={setSelectedCountry}
        visualizationType={visualizationType}
      />
      
      {/* UIレイヤー */}
      <UILayer 
        visualizationType={visualizationType}
        selectedMetric={selectedMetric}
        selectedCountry={selectedCountry}
        countries={countries}
        onVisualizationTypeChange={setVisualizationType}
        onMetricChange={setSelectedMetric}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </motion.div>
  );
};

/**
 * マップレイヤーコンポーネント
 * マップとそのコントロールを表示
 */
const MapLayer = ({ 
  countries, 
  loading, 
  selectedMetric, 
  selectedCountry, 
  onCountrySelect,
  visualizationType
}: {
  countries: any[];
  loading: boolean;
  selectedMetric: DataMetric;
  selectedCountry: string | null;
  onCountrySelect: (countryId: string | null) => void;
  visualizationType: 'map' | 'chart';
}) => (
  <motion.div 
    className="absolute inset-0 z-0"
    variants={itemVariants}
  >
    {visualizationType === 'map' ? (
      <WorldMap 
        countries={countries} 
        loading={loading} 
        selectedMetric={selectedMetric}
        onCountrySelect={onCountrySelect}
        selectedCountry={selectedCountry}
      />
    ) : (
      <div className="h-full bg-gray-50 p-4">
        <DataChart 
          countries={countries}
          loading={loading}
          selectedMetric={selectedMetric}
          selectedCountry={selectedCountry}
        />
      </div>
    )}
  </motion.div>
);

/**
 * UIレイヤーコンポーネント
 * ヘッダー、サイドバー、フッターなどのUIコンポーネントを表示
 */
const UILayer = ({ 
  visualizationType, 
  selectedMetric, 
  selectedCountry, 
  countries,
  onVisualizationTypeChange,
  onMetricChange,
  activeCategory,
  onCategoryChange,
  activeTab,
  onTabChange
}: {
  visualizationType: 'map' | 'chart';
  selectedMetric: DataMetric;
  selectedCountry: string | null;
  countries: any[];
  onVisualizationTypeChange: (type: 'map' | 'chart') => void;
  onMetricChange: (metric: DataMetric) => void;
  activeCategory: DataCategory;
  onCategoryChange: (category: DataCategory) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <motion.div 
        variants={itemVariants}
        className="flex flex-col h-full pointer-events-none"
      >
        {/* ヘッダー - ポインターイベント有効 */}
        <div className="pointer-events-auto">
          <Header />
        </div>
        
        {/* メインコンテンツ - コントロール付きサイドバー */}
        <div className="flex-grow flex">
          <SidebarProvider>
            <div className="h-full pointer-events-auto">
              <ExplorerSidebar 
                visualizationType={visualizationType}
                selectedMetric={selectedMetric}
                onVisualizationTypeChange={onVisualizationTypeChange}
                onMetricChange={onMetricChange}
                selectedCountry={selectedCountry}
                countries={countries}
              />
            </div>
          </SidebarProvider>
          
          {/* データビューパネル（右側） */}
          <div className="pointer-events-auto flex-grow max-w-xs lg:max-w-sm hidden md:block">
            <div className="h-full p-4 flex flex-col space-y-4 overflow-auto">
              <Tabs defaultValue="map" value={activeTab} onValueChange={onTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="map">{t('mapExplorer')}</TabsTrigger>
                  <TabsTrigger value="data">{t('dataExplorer')}</TabsTrigger>
                </TabsList>
                <TabsContent value="map" className="pt-4 space-y-4">
                  {/* カテゴリナビゲーション */}
                  <DataCategoryNav
                    activeCategory={activeCategory}
                    onCategoryChange={onCategoryChange}
                  />
                  
                  {/* フィーチャーインサイト */}
                  <FeaturedInsights />
                </TabsContent>
                <TabsContent value="data" className="pt-4">
                  {/* データテーブル */}
                  <CountryDataTable
                    countries={countries}
                    selectedMetric={selectedMetric}
                    onCountrySelect={(countryId) => {
                      onVisualizationTypeChange('map');
                      onTabChange('map');
                      setTimeout(() => {
                        onCountrySelect(countryId);
                      }, 300);
                    }}
                    selectedCountry={selectedCountry}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* フッター - ポインターイベント有効 */}
        <div className="pointer-events-auto">
          <Footer />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
