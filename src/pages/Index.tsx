
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCountryData } from '@/hooks/useCountryData';
import { initializeSentry } from '@/lib/sentry';
import { DataMetric } from '@/types/country';
import ErrorMessage from '@/components/ErrorMessage';
import MapLayer from '@/components/layers/MapLayer';
import MetricDropdown from '@/components/controls/MetricDropdown';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/layout/Header';

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
  const [selectedMetric, setSelectedMetric] = useState<DataMetric>('population_density');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // 国データのフェッチ
  const { countries, loading, error } = useCountryData();

  return (
    <motion.div 
      className="fixed inset-0 w-screen h-screen overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ヘッダー */}
      <Header 
        selectedMetric={selectedMetric}
        onMetricChange={setSelectedMetric}
      />
      
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
      
      {/* デスクトップ用メトリック選択ドロップダウン */}
      {!isMobile && (
        <div className="absolute top-4 right-24 z-20">
          <MetricDropdown 
            selectedMetric={selectedMetric}
            onMetricChange={setSelectedMetric}
          />
        </div>
      )}
    </motion.div>
  );
};

export default Index;
