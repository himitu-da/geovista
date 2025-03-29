
import React from 'react';
import { BarChart2, Database, Brain } from 'lucide-react';
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
                icon={<BarChart2 className="h-5 w-5 text-blue-600" />}
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
            </motion.ul>
          </div>
          <motion.div 
            className="relative rounded-3xl overflow-hidden shadow-apple-lg border border-gray-100"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=2070" 
              alt={t('dataDashboard')} 
              className="w-full h-auto rounded-3xl" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-3xl"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
