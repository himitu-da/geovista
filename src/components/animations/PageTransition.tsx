
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageVariants } from './variants/pageVariants';
import { transitions } from './variants/transitions';

// 特殊なコンポーネントをエクスポート
export { ContentTransition } from './ContentTransition';
export { StaggerContainer, StaggerItem } from './StaggerAnimation';

interface PageTransitionProps {
  children: React.ReactNode;
  transitionType?: keyof typeof pageVariants;
  backgroundEffect?: boolean;
}

/**
 * ページ遷移アニメーションの基本コンポーネント
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  transitionType = 'default',
  backgroundEffect = false,
}) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="sync">
      {backgroundEffect && (
        <motion.div
          key={`bg-${location.pathname}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0) 70%)',
            zIndex: -1,
          }}
        />
      )}
      
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants[transitionType]}
        transition={transitions[transitionType]}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// 特殊なバリエーション - ランディングページ用
export const LandingTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PageTransition transitionType="fancy" backgroundEffect={true}>{children}</PageTransition>
);

// 特殊なバリエーション - エクスプローラー用
export const ExplorerTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PageTransition transitionType="rotate" backgroundEffect={true}>{children}</PageTransition>
);

// 特殊なバリエーション - デフォルト
export const DefaultTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PageTransition backgroundEffect={true}>{children}</PageTransition>
);
