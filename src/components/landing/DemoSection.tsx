
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ButtonAnimation } from '@/components/animations/ButtonAnimation';
import { Globe, Map, BarChart3 } from 'lucide-react';

// 浮遊アニメーションの定義
const floatAnimation = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.8 }
  }
};

export const DemoSection = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* 装飾要素 */}
      <div className="absolute inset-0 overflow-hidden">
        <WorldMapDecoration />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
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
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center relative">
            {/* 浮遊するUI要素 */}
            <FloatingElement 
              icon={<Globe className="w-5 h-5 text-blue-500" />}
              text="Global Population"
              color="blue"
              position={{ top: '15%', left: '10%' }}
              delay={0.2}
            />
            
            <FloatingElement 
              icon={<BarChart3 className="w-5 h-5 text-green-500" />}
              text="Economic Growth"
              color="green"
              position={{ bottom: '20%', right: '15%' }}
              delay={0.4}
            />
            
            <FloatingElement 
              icon={<Map className="w-5 h-5 text-purple-500" />}
              text="Regional Insights"
              color="purple"
              position={{ top: '25%', right: '12%' }}
              delay={0.6}
            />
            
            {/* メインの画像 */}
            <motion.div 
              className="text-2xl text-apple-gray-500 px-6 py-4 bg-white rounded-xl shadow-apple-sm max-w-4xl w-full mx-8 relative z-10"
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
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
                >
                  <Globe className="ml-2 h-5 w-5" />
                </motion.span>
              </Button>
            </ButtonAnimation>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// 浮遊要素コンポーネント
interface FloatingElementProps {
  icon: React.ReactNode;
  text: string;
  color: 'blue' | 'green' | 'purple';
  position: { top?: string; bottom?: string; left?: string; right?: string };
  delay: number;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ icon, text, color, position, delay }) => {
  // 色に応じたスタイル
  const getBgColor = () => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-100';
      case 'green': return 'bg-green-50 border-green-100';
      case 'purple': return 'bg-purple-50 border-purple-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };
  
  return (
    <motion.div
      className={`absolute glass-effect ${getBgColor()} px-3 py-2 rounded-lg flex items-center gap-2 z-20 shadow-apple-sm`}
      style={position}
      variants={floatAnimation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      {icon}
      <span className="text-sm font-medium">{text}</span>
    </motion.div>
  );
};

// 世界地図の装飾コンポーネント
const WorldMapDecoration = () => {
  // ドット座標の生成（シンプルな世界地図を表現）
  const generateMapDots = () => {
    const dots = [];
    const rows = 15;
    const cols = 30;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // 特定のパターンでドットを配置して大陸の形を表現
        const shouldRender = Math.random() > 0.7;
        
        if (shouldRender) {
          const delay = Math.random() * 0.5;
          const size = Math.random() > 0.8 ? 'w-1.5 h-1.5' : 'w-1 h-1';
          const opacity = Math.random() > 0.7 ? 'opacity-30' : 'opacity-20';
          
          dots.push(
            <motion.div
              key={`dot-${r}-${c}`}
              className={`absolute ${size} rounded-full bg-blue-500 ${opacity}`}
              style={{
                top: `${(r / rows) * 100}%`,
                left: `${(c / cols) * 100}%`,
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: opacity.includes('30') ? 0.3 : 0.2 }}
              transition={{ delay, duration: 0.5 }}
            />
          );
        }
      }
    }
    
    return dots;
  };
  
  return (
    <div className="absolute inset-0 opacity-20">
      {generateMapDots()}
    </div>
  );
};
