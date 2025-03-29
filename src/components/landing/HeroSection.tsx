
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Globe } from 'lucide-react';
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
  },
  rotate: {
    initial: { rotate: 0 },
    animate: { rotate: 360, transition: { duration: 20, repeat: Infinity, ease: "linear" } }
  },
  float: {
    initial: { y: 0 },
    animate: { y: [0, -15, 0], transition: { duration: 5, repeat: Infinity, ease: "easeInOut" } }
  },
  pulse: {
    initial: { scale: 1 },
    animate: { scale: [1, 1.05, 1], transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } }
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
      <GlobeAnimation />
      <HeroContent t={t} />
    </section>
  );
};

/**
 * グローブアニメーション
 * 3Dの地球の回転アニメーション
 */
const GlobeAnimation = () => (
  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-20 -z-1 hidden lg:block">
    <motion.div
      variants={ANIMATION_VARIANTS.rotate}
      initial="initial"
      animate="animate"
      className="relative"
    >
      <Globe className="w-96 h-96 text-blue-500 opacity-30" strokeWidth={0.5} />
    </motion.div>
  </div>
);

/**
 * ヒーローセクションの背景要素
 * 背景画像と勾配のオーバーレイを表示
 */
const BackgroundElements = () => (
  <>
    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-10 z-0"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/90 z-0"></div>
    <motion.div 
      className="absolute left-10 top-20 w-8 h-8 rounded-full bg-blue-400 opacity-20"
      variants={ANIMATION_VARIANTS.float}
      initial="initial"
      animate="animate"
    />
    <motion.div 
      className="absolute right-20 bottom-40 w-12 h-12 rounded-full bg-blue-300 opacity-20"
      variants={ANIMATION_VARIANTS.float}
      initial="initial"
      animate="animate"
      transition={{ delay: 1 }}
    />
    <motion.div 
      className="absolute left-1/3 bottom-20 w-10 h-10 rounded-full bg-blue-500 opacity-10"
      variants={ANIMATION_VARIANTS.float}
      initial="initial"
      animate="animate"
      transition={{ delay: 2 }}
    />
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
    <motion.span
      variants={ANIMATION_VARIANTS.pulse}
      initial="initial"
      animate="animate"
      className="inline-flex items-center"
    >
      <Globe className="w-4 h-4 mr-2" /> {t('dataVizPlatform')}
    </motion.span>
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
    <motion.span 
      className="text-gradient-primary"
      animate={{ 
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    >
      {t('intuitively')}
    </motion.span>
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

// ボタンスタイルの共通クラス
const BUTTON_COMMON_CLASSES = "h-14 px-8 text-lg font-medium rounded-full transition-all w-full sm:w-auto flex items-center justify-center";

/**
 * ヒーローセクションのボタン群
 */
const HeroButtons = ({ t }: { t: (key: string) => string }) => (
  <motion.div 
    variants={ANIMATION_VARIANTS.fadeIn}
    className="flex flex-col sm:flex-row gap-4 mt-8"
  >
    <Link to="/explore" className="w-full sm:w-auto">
      <ButtonAnimation>
        <Button 
          size="lg" 
          className={`${BUTTON_COMMON_CLASSES} shadow-apple-md hover:shadow-apple-lg bg-primary hover:bg-primary/90`}
        >
          {t('startExploring')}
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          >
            <Globe className="ml-2 h-5 w-5" />
          </motion.span>
        </Button>
      </ButtonAnimation>
    </Link>
    <ButtonAnimation>
      <a 
        href="#features" 
        className={`${BUTTON_COMMON_CLASSES} text-apple-gray-700 bg-white border border-gray-200 shadow-apple-sm hover:shadow-apple-md`}
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
    <a href="#features" className="flex flex-col items-center text-apple-gray-500">
      <span className="text-sm mb-1">{t('scrollToExplore')}</span>
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="h-5 w-5" />
      </motion.div>
    </a>
  </motion.div>
);

