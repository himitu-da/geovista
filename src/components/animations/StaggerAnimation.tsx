
import React from 'react';
import { motion } from 'framer-motion';

/**
 * スタッガー効果のあるコンテナ（子要素をずらして表示）
 */
export const StaggerContainer: React.FC<{ 
  children: React.ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
}> = ({ 
  children, 
  className = '', 
  delay = 0,
  staggerChildren = 0.1
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          delay,
          staggerChildren,
          delayChildren: delay,
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

/**
 * スタッガー効果の子要素
 */
export const StaggerItem: React.FC<{ 
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: {
          type: 'spring',
          damping: 12,
          stiffness: 200
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);
