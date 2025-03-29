
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
import { useIsMobile } from '@/hooks/use-mobile';

// アニメーション設定
const itemVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.3 }
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
  const isMobile = useIsMobile();
  
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      <motion.div 
        variants={itemVariants}
        className="flex flex-col h-full pointer-events-none"
      >
        {/* ヘッダー - ポインターイベント有効 （最小化） */}
        <div className="pointer-events-auto h-8 sm:h-10">
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
          {selectedCountry && !isMobile && (
            <div className="pointer-events-auto w-56 sm:w-64 max-w-[18vw] hidden lg:block bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-l border-gray-100 dark:border-gray-700 transition-all">
              <div className="h-full p-1 sm:p-2 flex flex-col space-y-1 sm:space-y-2 overflow-auto">
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
        <div className="pointer-events-auto h-5 sm:h-6">
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
        <TabsTrigger value="map" className="text-[10px] sm:text-xs py-0.5 sm:py-1">{t('mapExplorer')}</TabsTrigger>
        <TabsTrigger value="data" className="text-[10px] sm:text-xs py-0.5 sm:py-1">{t('dataExplorer')}</TabsTrigger>
      </TabsList>
      <TabsContent value="map" className="pt-1 sm:pt-2 space-y-1 sm:space-y-3">
        {/* カテゴリナビゲーション */}
        <DataCategoryNav
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
        
        {/* フィーチャーインサイト */}
        <FeaturedInsights />
      </TabsContent>
      <TabsContent value="data" className="pt-1 sm:pt-2">
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
