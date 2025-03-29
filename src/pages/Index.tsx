
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCountryData } from '@/hooks/useCountryData';
import { initializeSentry } from '@/lib/sentry';
import ErrorMessage from '@/components/ErrorMessage';
import MapLayer from '@/components/layers/MapLayer';
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
 * インデックスページコンポーネント - シンプル化バージョン
 */
const Index = () => {
  // Sentryの初期化
  useEffect(() => {
    initializeSentry();
  }, []);

  // UIの状態
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // 国データのフェッチ
  const { countries, loading, error } = useCountryData();

  return (
    <>
      {isMobile && <Header />}
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
          selectedCountry={selectedCountry}
          onCountrySelect={setSelectedCountry}
        />
      </motion.div>
    </>
  );
};

export default Index;
