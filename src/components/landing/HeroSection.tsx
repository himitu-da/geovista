
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ButtonAnimation } from '@/components/animations/ButtonAnimation';

// アニメーション関連の定数の定義
const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  },
  staggeredContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  }
};

/**
 * ヒーローセクションコンポーネント
 * ランディングページの最上部に表示される主要なセクション
 */
export const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden">
      <BackgroundElements />
      <HeroContent t={t} />
    </section>
  );
};

/**
 * ヒーローセクションの背景要素
 * 背景画像と勾配のオーバーレイを表示
 */
const BackgroundElements = () => (
  <>
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-10 z-0"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/90 z-0"></div>
  </>
);

/**
 * ヒーローセクションのメインコンテンツ
 */
const HeroContent = ({ t }: { t: (key: string) => string }) => (
  <motion.div 
    className="max-w-4xl mx-auto relative z-10"
    initial="hidden"
    animate="visible"
    variants={ANIMATION_VARIANTS.staggeredContainer}
  >
    <HeroBadge t={t} />
    <HeroHeading t={t} />
    <HeroDescription t={t} />
    <HeroButtons t={t} />
    <ScrollIndicator t={t} />
  </motion.div>
);

/**
 * ヒーローセクションのバッジ
 */
const HeroBadge = ({ t }: { t: (key: string) => string }) => (
  <motion.span 
    variants={ANIMATION_VARIANTS.fadeIn}
    className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-6 border border-blue-100 shadow-sm"
  >
    {t('dataVizPlatform')}
  </motion.span>
);

/**
 * ヒーローセクションの見出し
 */
const HeroHeading = ({ t }: { t: (key: string) => string }) => (
  <motion.h1 
    variants={ANIMATION_VARIANTS.fadeIn}
    className="text-5xl md:text-6xl font-bold text-apple-gray-700 tracking-tight mb-6 leading-tight"
  >
    {t('exploreWorldData')}<br className="hidden md:block" />
    <span className="text-gradient-primary">{t('intuitively')}</span>
  </motion.h1>
);

/**
 * ヒーローセクションの説明文
 */
const HeroDescription = ({ t }: { t: (key: string) => string }) => (
  <motion.p 
    variants={ANIMATION_VARIANTS.fadeIn}
    className="text-xl md:text-2xl text-apple-gray-500 mb-8 leading-relaxed max-w-2xl"
  >
    {t('landingDescription')}
  </motion.p>
);

/**
 * ヒーローセクションのボタン群
 */
const HeroButtons = ({ t }: { t: (key: string) => string }) => (
  <motion.div 
    variants={ANIMATION_VARIANTS.fadeIn}
    className="flex flex-col sm:flex-row gap-4 mt-8"
  >
    <Link to="/explore">
      <ButtonAnimation>
        <Button 
          size="lg" 
          className="px-8 py-6 rounded-full text-lg shadow-apple-md hover:shadow-apple-lg transition-all bg-primary hover:bg-primary/90 w-full sm:w-auto"
        >
          {t('startExploring')}
        </Button>
      </ButtonAnimation>
    </Link>
    <ButtonAnimation>
      <a 
        href="#features" 
        className="inline-flex items-center justify-center px-8 py-6 text-lg font-medium text-apple-gray-700 bg-white border border-gray-200 rounded-full shadow-apple-sm hover:shadow-apple-md transition-all w-full sm:w-auto"
      >
        {t('viewFeatures')}
      </a>
    </ButtonAnimation>
  </motion.div>
);

/**
 * スクロールインジケーター
 */
const ScrollIndicator = ({ t }: { t: (key: string) => string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.2, duration: 0.5 }}
    className="flex justify-center mt-16"
  >
    <a href="#features" className="flex flex-col items-center text-apple-gray-500 animate-bounce">
      <span className="text-sm mb-1">{t('scrollToExplore')}</span>
      <ChevronDown className="h-5 w-5" />
    </a>
  </motion.div>
);
