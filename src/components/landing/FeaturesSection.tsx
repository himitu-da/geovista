
import React from 'react';
import { Globe, BarChart3, Users, Map, Compass, Database } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { FeatureCard } from './FeatureCard';

// アニメーション変数
const staggeredContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

// フローティングアニメーション
const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
  }
};

// 回転アニメーション
const rotateAnimation = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: { duration: 20, repeat: Infinity, ease: "linear" }
  }
};

export const FeaturesSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* 装飾要素 - フローティングオブジェクト */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute left-[5%] top-[15%] opacity-10"
          variants={floatAnimation}
          initial="initial"
          animate="animate"
        >
          <Globe className="h-16 w-16 text-blue-500" strokeWidth={0.5} />
        </motion.div>
        
        <motion.div
          className="absolute right-[10%] top-[30%] opacity-10"
          variants={rotateAnimation}
          initial="initial"
          animate="animate"
        >
          <Map className="h-20 w-20 text-green-500" strokeWidth={0.5} />
        </motion.div>
        
        <motion.div
          className="absolute left-[15%] bottom-[10%] opacity-10"
          variants={floatAnimation}
          initial="initial"
          animate="animate"
          transition={{ delay: 1 }}
        >
          <Database className="h-12 w-12 text-purple-500" strokeWidth={0.5} />
        </motion.div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-apple-gray-700 mb-4">
            {t('intuitiveDataViz')}
          </h2>
          <p className="text-xl text-apple-gray-500 max-w-2xl mx-auto">
            {t('powerfulTools')}
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggeredContainer}
        >
          <FeatureCard 
            icon={<Globe className="h-8 w-8 text-blue-500" />}
            title={t('interactiveMap')}
            description={t('interactiveMapDesc')}
            color="blue"
          />
          <FeatureCard 
            icon={<BarChart3 className="h-8 w-8 text-green-500" />}
            title={t('dataAnalysis')}
            description={t('dataAnalysisDesc')}
            color="green"
          />
          <FeatureCard 
            icon={<Users className="h-8 w-8 text-purple-500" />}
            title={t('demographicInsights')}
            description={t('demographicInsightsDesc')}
            color="purple"
          />
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 gap-8 mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggeredContainer}
          transition={{ delayChildren: 0.3 }}
        >
          <FeatureCard 
            icon={<Map className="h-8 w-8 text-blue-500" />}
            title={t('geographicalPatterns')}
            description={t('geographicalPatternsDesc') || "Discover geographical patterns and correlations across the globe with our advanced mapping tools."}
            color="blue"
          />
          <FeatureCard 
            icon={<Compass className="h-8 w-8 text-green-500" />}
            title={t('globalExploration')}
            description={t('globalExplorationDesc') || "Navigate through global data with precision and uncover insights about our interconnected world."}
            color="green"
          />
        </motion.div>
      </div>
    </section>
  );
};
