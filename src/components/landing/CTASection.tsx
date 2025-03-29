
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ButtonAnimation } from '@/components/animations/ButtonAnimation';

export const CTASection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-24 px-6 text-center bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')] bg-cover bg-center opacity-5 z-0"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/90 z-0"></div>
      
      <motion.div 
        className="max-w-3xl mx-auto relative z-10"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-apple-gray-700">
          {t('readyToExplore')}
        </h2>
        <p className="text-xl text-apple-gray-500 mb-8 leading-relaxed">
          {t('startYourJourney')}
        </p>
        <ButtonAnimation>
          <Link to="/explore">
            <Button size="lg" className="px-10 py-7 text-xl rounded-full shadow-apple-lg hover:shadow-apple-xl transition-all bg-primary hover:bg-primary/90">
              {t('launchExplorer')} <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </ButtonAnimation>
      </motion.div>
    </section>
  );
};
