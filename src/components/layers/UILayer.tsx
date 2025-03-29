
import React from 'react';
import { motion } from 'framer-motion';
import { SidebarProvider } from '@/components/ui/sidebar';
import ExplorerSidebar from '@/components/layout/ExplorerSidebar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { DataMetric, CountryData } from '@/types/country';
import { useLanguage } from '@/contexts/LanguageContext';
import { DataCategory } from '@/components/explore/DataCategoryNav';
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
  selectedMetric, 
  selectedCountry, 
  countries,
  onMetricChange,
  activeCategory,
  onCategoryChange,
  onCountrySelect
}: {
  selectedMetric: DataMetric;
  selectedCountry: string | null;
  countries: CountryData[];
  onMetricChange: (metric: DataMetric) => void;
  activeCategory: DataCategory;
  onCategoryChange: (category: DataCategory) => void;
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
                selectedMetric={selectedMetric}
                onMetricChange={onMetricChange}
                selectedCountry={selectedCountry}
                countries={countries}
                activeCategory={activeCategory}
                onCategoryChange={onCategoryChange}
              />
            </div>
          </SidebarProvider>
        </div>
        
        {/* フッター - ポインターイベント有効 （最小化） */}
        <div className="pointer-events-auto h-5 sm:h-6">
          <Footer />
        </div>
      </motion.div>
    </div>
  );
};

export default UILayer;
