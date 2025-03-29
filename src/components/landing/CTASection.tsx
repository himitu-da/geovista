
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ButtonAnimation } from '@/components/animations/ButtonAnimation';

export const CTASection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-24 px-6 text-center bg-gradient-to-b from-white to-blue-50 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0">
        <GlobeDecoration />
      </div>
      
      <motion.div 
        className="max-w-3xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-block mb-6"
          whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
        >
          <Globe className="w-16 h-16 mx-auto text-blue-500 opacity-90" />
        </motion.div>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-apple-gray-700">
          {t('readyToExplore')}
        </h2>
        <p className="text-xl text-apple-gray-500 mb-8 leading-relaxed">
          {t('startYourJourney')}
        </p>
        <ButtonAnimation>
          <Link to="/explore">
            <Button size="lg" className="px-10 py-7 text-xl rounded-full shadow-apple-lg hover:shadow-apple-xl transition-all bg-primary hover:bg-primary/90">
              {t('launchExplorer')} 
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              >
                <ArrowRight className="ml-2 h-6 w-6" />
              </motion.span>
            </Button>
          </Link>
        </ButtonAnimation>
        
        {/* 浮遊する地球アイコン */}
        <div className="absolute -right-20 top-0 opacity-20 hidden md:block">
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 360] 
            }}
            transition={{ 
              y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 30, repeat: Infinity, ease: "linear" }
            }}
          >
            <Globe className="w-40 h-40 text-blue-500" strokeWidth={0.5} />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

// 地球儀の背景装飾
const GlobeDecoration = () => {
  const generateGlobePatterns = () => {
    const patterns = [];
    const patternCount = 20;
    
    for (let i = 0; i < patternCount; i++) {
      const size = Math.random() * 8 + 2;
      const delay = Math.random() * 0.8;
      const duration = Math.random() * 4 + 3;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const opacity = Math.random() * 0.15 + 0.05;
      
      patterns.push(
        <motion.div
          key={`globe-pattern-${i}`}
          className="absolute rounded-full border border-blue-300"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            top: `${top}%`,
            opacity
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay, duration: 0.5 }}
        />
      );
      
      // 円軌道パターン
      if (i % 5 === 0) {
        const orbitSize = Math.random() * 60 + 30;
        patterns.push(
          <motion.div
            key={`orbit-${i}`}
            className="absolute rounded-full border border-blue-300"
            style={{
              width: `${orbitSize}px`,
              height: `${orbitSize}px`,
              left: `${left}%`,
              top: `${top}%`,
              opacity: opacity * 0.7
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ 
              scale: { delay, duration: 0.5 },
              rotate: { duration, repeat: Infinity, ease: "linear" }
            }}
          />
        );
      }
    }
    
    return patterns;
  };
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {generateGlobePatterns()}
    </div>
  );
};
