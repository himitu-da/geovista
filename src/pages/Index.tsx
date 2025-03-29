
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
  // Sentryの初期化
  useEffect(() => {
    initializeSentry();
  }, []);

  // UIの状態
  const [visualizationType, setVisualizationType] = useState<'map' | 'chart'>('map');
  const [selectedMetric, setSelectedMetric] = useState<DataMetric>('population_density');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

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
      />
      
      {/* UIレイヤー */}
      <UILayer 
        visualizationType={visualizationType}
        selectedMetric={selectedMetric}
        selectedCountry={selectedCountry}
        countries={countries}
        onVisualizationTypeChange={setVisualizationType}
        onMetricChange={setSelectedMetric}
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
  onCountrySelect 
}: {
  countries: any[];
  loading: boolean;
  selectedMetric: DataMetric;
  selectedCountry: string | null;
  onCountrySelect: (countryId: string | null) => void;
}) => (
  <motion.div 
    className="absolute inset-0 z-0"
    variants={itemVariants}
  >
    <WorldMap 
      countries={countries} 
      loading={loading} 
      selectedMetric={selectedMetric}
      onCountrySelect={onCountrySelect}
      selectedCountry={selectedCountry}
    />
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
  onMetricChange
}: {
  visualizationType: 'map' | 'chart';
  selectedMetric: DataMetric;
  selectedCountry: string | null;
  countries: any[];
  onVisualizationTypeChange: (type: 'map' | 'chart') => void;
  onMetricChange: (metric: DataMetric) => void;
}) => (
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
      </div>
      
      {/* フッター - ポインターイベント有効 */}
      <div className="pointer-events-auto">
        <Footer />
      </div>
    </motion.div>
  </div>
);

export default Index;
