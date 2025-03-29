
import React from 'react';
import { motion } from 'framer-motion';
import { SidebarProvider } from '@/components/ui/sidebar';
import ExplorerSidebar from '@/components/layout/ExplorerSidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { DataMetric, CountryData } from '@/types/country';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataCategoryNav, { DataCategory } from '@/components/explore/DataCategoryNav';
import FeaturedInsights from '@/components/explore/FeaturedInsights';
import CountryDataTable from '@/components/explore/CountryDataTable';

// アニメーション設定
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

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
  onTabChange,
  onCountrySelect
}: {
  visualizationType: 'map' | 'chart';
  selectedMetric: DataMetric;
  selectedCountry: string | null;
  countries: CountryData[];
  onVisualizationTypeChange: (type: 'map' | 'chart') => void;
  onMetricChange: (metric: DataMetric) => void;
  activeCategory: DataCategory;
  onCategoryChange: (category: DataCategory) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCountrySelect: (countryId: string | null) => void;
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <motion.div 
        variants={itemVariants}
        className="flex flex-col h-full pointer-events-none"
      >
        {/* ヘッダー - ポインターイベント有効 （最小化） */}
        <div className="pointer-events-auto h-12">
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
          
          {/* データビューパネル（右側） - 必要な場合のみ表示 */}
          {selectedCountry && (
            <div className="pointer-events-auto max-w-[20vw] hidden lg:block opacity-90 hover:opacity-100 transition-opacity">
              <div className="h-full p-2 flex flex-col space-y-2 overflow-auto">
                <DataExplorerTabs 
                  activeTab={activeTab}
                  onTabChange={onTabChange}
                  activeCategory={activeCategory}
                  onCategoryChange={onCategoryChange}
                  countries={countries}
                  selectedMetric={selectedMetric}
                  onCountrySelect={onCountrySelect}
                  selectedCountry={selectedCountry}
                  onVisualizationTypeChange={onVisualizationTypeChange}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* フッター - ポインターイベント有効 （最小化） */}
        <div className="pointer-events-auto h-8">
          <Footer />
        </div>
      </motion.div>
    </div>
  );
};

interface DataExplorerTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeCategory: DataCategory;
  onCategoryChange: (category: DataCategory) => void;
  countries: CountryData[];
  selectedMetric: DataMetric;
  onCountrySelect: (countryId: string | null) => void;
  selectedCountry: string | null;
  onVisualizationTypeChange: (type: 'map' | 'chart') => void;
}

const DataExplorerTabs: React.FC<DataExplorerTabsProps> = ({
  activeTab,
  onTabChange,
  activeCategory,
  onCategoryChange,
  countries,
  selectedMetric,
  onCountrySelect,
  selectedCountry,
  onVisualizationTypeChange
}) => {
  const { t } = useLanguage();
  
  return (
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
  );
};

export default UILayer;
