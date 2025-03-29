
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { motion } from 'framer-motion';
import { ButtonAnimation } from '@/components/animations/ButtonAnimation';
import ParticleBackground from '@/components/animations/ParticleBackground';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { DetailSection } from '@/components/landing/DetailSection';
import { DemoSection } from '@/components/landing/DemoSection';
import { CTASection } from '@/components/landing/CTASection';
import { LandingFooter } from '@/components/landing/LandingFooter';

/**
 * LPメインコンポーネント
 * ユーザーに直感的にサービスの価値を伝える
 */
const Landing = () => {
  const { t } = useLanguage();
  
  // スクロールイベントを管理
  useEffect(() => {
    const handleScroll = () => {
      // スクロール位置に応じたアニメーション管理（必要に応じて実装）
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* パーティクル背景 */}
      <ParticleBackground />
      
      {/* ヘッダーセクション */}
      <LandingHeader />

      {/* メインコンテンツ */}
      <main className="flex-grow relative z-10">
        {/* ヒーローセクション */}
        <HeroSection />

        {/* 特徴セクション */}
        <FeaturesSection />

        {/* 詳細セクション */}
        <DetailSection />

        {/* 機能デモセクション */}
        <DemoSection />

        {/* CTAセクション */}
        <CTASection />
      </main>

      {/* フッター */}
      <LandingFooter />
    </div>
  );
};

export default Landing;
