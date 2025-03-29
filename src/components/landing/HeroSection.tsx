
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ButtonAnimation } from '@/components/animations/ButtonAnimation';

// アニメーション変数の定義
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggeredContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export const HeroSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden">
      {/* ヒーローセクションの背景画像と勾配のオーバーレイ */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-10 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/90 z-0"></div>
      
      <motion.div 
        className="max-w-4xl mx-auto relative z-10"
        initial="hidden"
        animate="visible"
        variants={staggeredContainer}
      >
        <motion.span 
          variants={fadeIn}
          className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-6 border border-blue-100 shadow-sm"
        >
          {t('dataVizPlatform')}
        </motion.span>
        
        <motion.h1 
          variants={fadeIn}
          className="text-5xl md:text-6xl font-bold text-apple-gray-700 tracking-tight mb-6 leading-tight"
        >
          {t('exploreWorldData')}<br className="hidden md:block" />
          <span className="text-gradient-primary">{t('intuitively')}</span>
        </motion.h1>
        
        <motion.p 
          variants={fadeIn}
          className="text-xl md:text-2xl text-apple-gray-500 mb-8 leading-relaxed max-w-2xl"
        >
          {t('landingDescription')}
        </motion.p>
        
        <motion.div 
          variants={fadeIn}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <Link to="/explore">
            <ButtonAnimation>
              <Button size="lg" className="px-8 py-6 rounded-full text-lg shadow-apple-md hover:shadow-apple-lg transition-all bg-primary hover:bg-primary/90">
                {t('startExploring')}
              </Button>
            </ButtonAnimation>
          </Link>
          <ButtonAnimation>
            <a href="#features" className="inline-flex items-center justify-center px-8 py-6 text-lg font-medium text-apple-gray-700 bg-white rounded-full shadow-apple-sm hover:shadow-apple-md transition-all">
              {t('viewFeatures')}
            </a>
          </ButtonAnimation>
        </motion.div>
        
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
      </motion.div>
    </section>
  );
};
