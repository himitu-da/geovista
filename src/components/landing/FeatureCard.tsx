
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
  
  return (
    <motion.div 
      className="p-8 rounded-3xl bg-white shadow-apple-md hover:shadow-apple-lg transition-all border border-gray-100 group"
      variants={fadeInUp}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
    >
      <div className={`w-14 h-14 ${color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : 'bg-purple-100'} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-2xl font-semibold mb-4 text-apple-gray-700">{title}</h3>
      <p className="text-apple-gray-500 text-lg">
        {description}
      </p>
    </motion.div>
  );
};
