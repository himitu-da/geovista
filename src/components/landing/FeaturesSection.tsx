
import React from 'react';
import { Globe, BarChart3, Users, Map, Compass } from 'lucide-react';
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

export const FeaturesSection = () => {
  const { t } = useLanguage();
  
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
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
