
import React from 'react';
import { motion } from 'framer-motion';

/**
 * コンテンツが切り替わる際のアニメーション（コンポーネント内での使用）
 */
export const ContentTransition: React.FC<{ 
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        delay,
        ease: 'easeOut'
      }
    }}
    exit={{ 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3,
        ease: 'easeIn'
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);
