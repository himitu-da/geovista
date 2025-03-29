
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ButtonAnimation } from '@/components/animations/ButtonAnimation';

export const DemoSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-apple-gray-700 mb-4 tracking-tight">
            {t('keyFeatures')}
          </h2>
          <p className="text-xl text-apple-gray-500 max-w-2xl mx-auto">
            {t('experienceFeatures')}
          </p>
        </motion.div>
        
        <motion.div 
          className="relative rounded-3xl overflow-hidden shadow-apple-lg border border-gray-100 aspect-video mb-12 bg-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
            <motion.div 
              className="text-2xl text-apple-gray-500 px-6 py-4 bg-white rounded-xl shadow-apple-sm"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426"
                alt="Dashboard preview"
                className="w-full h-auto max-w-4xl mx-auto rounded-lg opacity-95"
              />
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link to="/explore">
            <ButtonAnimation>
              <Button size="lg" className="px-8 py-6 rounded-full text-lg shadow-apple-md hover:shadow-apple-lg transition-all bg-primary hover:bg-primary/90">
                {t('launchExplorerNow')}
              </Button>
            </ButtonAnimation>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
