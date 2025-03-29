
import React from 'react';
import { BarChart2, Database, Brain, Globe, Compass } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { FeatureListItem } from './FeatureListItem';

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

// 地球の回転アニメーション
const globeRotate = {
  hidden: { rotate: 0 },
  visible: { 
    rotate: 360,
    transition: {
      duration: 20,
      ease: "linear",
      repeat: Infinity
    }
  }
};

export const DetailSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          className="grid md:grid-cols-2 gap-16 items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-apple-gray-700 mb-6 tracking-tight"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {t('simplifyComplexData')}<br />
              <motion.span 
                className="text-gradient-primary"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                {t('worldwideData') || "Worldwide Data"}
              </motion.span>
            </motion.h2>
            <motion.p 
              className="text-xl text-apple-gray-500 mb-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {t('designedFor')}
            </motion.p>
            <motion.ul 
              className="space-y-4"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggeredContainer}
            >
              <FeatureListItem 
                icon={<Globe className="h-5 w-5 text-blue-600" />}
                text={t('feature1')}
              />
              <FeatureListItem 
                icon={<Database className="h-5 w-5 text-blue-600" />}
                text={t('feature2')}
              />
              <FeatureListItem 
                icon={<Brain className="h-5 w-5 text-blue-600" />}
                text={t('feature3')}
              />
              <FeatureListItem 
                icon={<Compass className="h-5 w-5 text-blue-600" />}
                text={t('feature4') || "Navigate global trends with precision"}
              />
            </motion.ul>
          </div>
          <motion.div 
            className="relative rounded-3xl overflow-hidden shadow-apple-lg border border-gray-100 aspect-video"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* 地球の背景効果 */}
            <motion.div
              className="absolute -right-16 -top-16 w-32 h-32 opacity-10 z-0"
              variants={globeRotate}
              initial="hidden"
              animate="visible"
            >
              <Globe className="w-full h-full text-blue-500" strokeWidth={0.5} />
            </motion.div>
            
            {/* メイン画像 */}
            <img 
              src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2070" 
              alt={t('dataDashboard')} 
              className="w-full h-full object-cover rounded-3xl" 
            />
            
            {/* オーバーレイグラデーション */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl"></div>
            
            {/* フローティングUI要素 */}
            <motion.div
              className="absolute left-6 bottom-6 glass-effect px-4 py-2 rounded-xl flex items-center gap-2"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Globe className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-apple-gray-700">Global Insights</span>
            </motion.div>
            
            <motion.div
              className="absolute right-6 top-6 glass-effect px-3 py-1 rounded-full text-xs font-medium"
              initial={{ y: -20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              World Data Explorer
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
