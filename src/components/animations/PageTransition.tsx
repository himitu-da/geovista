
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// ページ遷移アニメーションの基本設定
const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    scale: 1,
  },
  out: {
    opacity: 0,
    scale: 1.02,
  },
};

// 異なるタイプのアニメーション効果
const transitions = {
  default: {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  },
  slide: {
    type: 'tween',
    ease: 'circOut',
    duration: 0.5,
  },
  spring: {
    type: 'spring',
    stiffness: 100,
    damping: 20,
  },
};

interface PageTransitionProps {
  children: React.ReactNode;
  transitionType?: 'default' | 'slide' | 'spring';
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  transitionType = 'default',
}) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={transitions[transitionType]}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// 各ページタイプに特化したアニメーション
export const LandingTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PageTransition transitionType="spring">{children}</PageTransition>
);

export const ExplorerTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PageTransition transitionType="slide">{children}</PageTransition>
);

// 汎用的なページ遷移アニメーション
export const DefaultTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PageTransition>{children}</PageTransition>
);
