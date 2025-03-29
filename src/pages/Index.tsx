
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCountryData } from '@/hooks/useCountryData';
import { initializeSentry } from '@/lib/sentry';
import { DataMetric } from '@/types/country';
import ErrorMessage from '@/components/ErrorMessage';
import MapLayer from '@/components/layers/MapLayer';
import UILayer from '@/components/layers/UILayer';
import { DataCategory } from '@/components/explore/DataCategoryNav';

// アニメーション設定
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.3,
      staggerChildren: 0.05 
    }
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
        onCountrySelect={setSelectedCountry}
      />
    </motion.div>
  );
};

export default Index;
