
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "blue" | "green" | "purple";
}

/**
 * 特徴カードコンポーネント
 * 各機能の紹介用カード - 統一されたスタイル
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  // 色に基づいた背景グラデーションを定義
  const getGradientBg = () => {
    switch (color) {
      case 'blue':
        return 'from-blue-50 to-white';
      case 'green':
        return 'from-green-50 to-white';
      case 'purple':
        return 'from-purple-50 to-white';
      default:
        return 'from-blue-50 to-white';
    }
  };
  
  // 色に基づいたアイコン背景を定義
  const getIconBg = () => {
    switch (color) {
      case 'blue':
        return 'bg-blue-100';
      case 'green':
        return 'bg-green-100';
      case 'purple':
        return 'bg-purple-100';
      default:
        return 'bg-blue-100';
    }
  };
  
  // 世界的なデザインのための装飾要素
  const decorationElements = () => {
    const elements = [];
    
    // 色に基づいた装飾円を生成
    for (let i = 0; i < 3; i++) {
      const size = Math.floor(Math.random() * 4) + 2;
      const top = Math.floor(Math.random() * 80) + 10;
      const right = Math.floor(Math.random() * 80) + 10;
      const opacity = (Math.random() * 0.15) + 0.05;
      const delay = i * 0.2;
      
      let bgColor;
      switch (color) {
        case 'blue':
          bgColor = 'bg-blue-500';
          break;
        case 'green':
          bgColor = 'bg-green-500';
          break;
        case 'purple':
          bgColor = 'bg-purple-500';
          break;
        default:
          bgColor = 'bg-blue-500';
      }
      
      elements.push(
        <motion.div
          key={`decoration-${i}`}
          className={`absolute rounded-full ${bgColor}`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            right: `${right}%`,
            opacity
          }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{ delay, duration: 0.5 }}
          viewport={{ once: true }}
        />
      );
    }
    
    return elements;
  };
  
  return (
    <motion.div 
      className={`p-8 rounded-3xl bg-gradient-to-br ${getGradientBg()} shadow-apple-md hover:shadow-apple-lg transition-all border border-gray-100 group overflow-hidden relative`}
      variants={fadeInUp}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      {/* 装飾要素 */}
      {decorationElements()}
      
      {/* メインコンテンツ */}
      <div className="relative z-10">
        <motion.div 
          className={`w-14 h-14 ${getIconBg()} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
          whileHover={{ rotate: [0, -10, 10, -5, 0], transition: { duration: 0.5 } }}
        >
          {icon}
        </motion.div>
        
        <motion.h3 
          className="text-2xl font-semibold mb-4 text-apple-gray-700"
          whileHover={{ x: 3, transition: { duration: 0.2 } }}
        >
          {title}
        </motion.h3>
        
        <p className="text-apple-gray-500 text-lg relative z-10">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
