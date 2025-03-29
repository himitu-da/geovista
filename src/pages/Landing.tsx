
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, BarChart3, Users, BarChart2, Database, Brain, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
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

/**
 * LPメインコンポーネント
 * ユーザーに直感的にサービスの価値を伝える
 */
const Landing = () => {
  const { t } = useLanguage();
  
  // スクロールイベントを管理
  useEffect(() => {
    const handleScroll = () => {
      // スクロール位置に応じたアニメーション管理（必要に応じて実装）
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* ヘッダーセクション */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-apple-gray-700">World Data Explorer</h1>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Link to="/explore">
              <ButtonAnimation>
                <Button variant="outline" className="flex items-center gap-2 rounded-full hover:bg-primary hover:text-white transition-all">
                  {t('launchExplorer')} <ArrowRight className="h-4 w-4" />
                </Button>
              </ButtonAnimation>
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="flex-grow">
        {/* ヒーローセクション */}
        <section className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden">
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
              className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-6"
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

        {/* 特徴セクション */}
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
          </div>
        </section>

        {/* 詳細セクション */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50">
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* 機能デモセクション */}
        <section className="py-20 bg-white">
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
              className="relative rounded-3xl overflow-hidden shadow-apple-lg border border-gray-100 aspect-video mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <motion.p 
                  className="text-2xl text-apple-gray-500 px-6 py-4 bg-white rounded-xl shadow-apple-sm"
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  {t('demoPlaceholder')}
                </motion.p>
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

        {/* CTAセクション */}
        <section className="py-24 px-6 text-center bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
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
      </main>

      {/* フッター */}
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-apple-gray-700 mb-2">World Data Explorer</h3>
              <p className="text-apple-gray-500">{t('globalDataVisualization')}</p>
            </div>
            <div className="text-apple-gray-500">
              &copy; {new Date().getFullYear()} World Data Explorer | {t('allRightsReserved')}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/**
 * 特徴カードコンポーネント
 * 各機能の紹介用カード
 */
const FeatureCard = ({ icon, title, description, color }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: "blue" | "green" | "purple";
}) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  const getBackgroundColor = (color: string) => {
    switch(color) {
      case "blue": return "bg-blue-100";
      case "green": return "bg-green-100";
      case "purple": return "bg-purple-100";
      default: return "bg-blue-100";
    }
  };
  
  return (
    <motion.div 
      className="p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white shadow-apple-md hover:shadow-apple-lg transition-all border border-gray-100 group"
      variants={fadeInUp}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      <div className={`w-14 h-14 ${getBackgroundColor(color)} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-4 text-apple-gray-700">{title}</h3>
      <p className="text-apple-gray-500 text-lg">
        {description}
      </p>
    </motion.div>
  );
};

/**
 * 特徴リストアイテムコンポーネント
 * 機能の詳細リスト項目
 */
const FeatureListItem = ({ icon, text }: { icon: React.ReactNode; text: string }) => {
  const fadeIn = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };
  
  return (
    <motion.li 
      className="flex items-start"
      variants={fadeIn}
    >
      <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
        {icon}
      </div>
      <span className="text-lg text-apple-gray-600">{text}</span>
    </motion.li>
  );
};

export default Landing;
