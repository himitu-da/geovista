
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

// ページ遷移アニメーションのバリエーション
const pageVariants = {
  // 標準のフェードとスケールの組み合わせ
  default: {
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
  },
  
  // スライド効果（横方向）
  slide: {
    initial: {
      opacity: 0,
      x: -20,
    },
    in: {
      opacity: 1,
      x: 0,
    },
    out: {
      opacity: 0,
      x: 20,
    },
  },
  
  // バウンス効果（スプリングを使用）
  spring: {
    initial: {
      opacity: 0,
      y: 40,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -40,
    },
  },
  
  // 新規: 回転効果
  rotate: {
    initial: {
      opacity: 0,
      rotateY: -10,
      perspective: 1000,
    },
    in: {
      opacity: 1,
      rotateY: 0,
      perspective: 1000,
    },
    out: {
      opacity: 0,
      rotateY: 10,
      perspective: 1000,
    },
  },
  
  // 新規: スケールと回転の組み合わせ
  fancy: {
    initial: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      rotateZ: -2,
    },
    in: {
      opacity: 1,
      scale: 1,
      y: 0,
      rotateZ: 0,
    },
    out: {
      opacity: 0,
      scale: 0.9,
      y: -20,
      rotateZ: 2,
    },
  },
  
  // 新規: 3Dフリップ効果
  flip: {
    initial: {
      opacity: 0,
      rotateX: 90,
      perspective: 1200,
    },
    in: {
      opacity: 1,
      rotateX: 0,
      perspective: 1200,
    },
    out: {
      opacity: 0,
      rotateX: -90,
      perspective: 1200,
    },
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
  rotate: {
    type: 'spring',
    stiffness: 80,
    damping: 15,
  },
  fancy: {
    type: 'spring',
    stiffness: 100,
    damping: 10,
  },
  flip: {
    type: 'spring',
    stiffness: 120,
    damping: 12,
  },
};

interface PageTransitionProps {
  children: React.ReactNode;
  transitionType?: 'default' | 'slide' | 'spring' | 'rotate' | 'fancy' | 'flip';
  backgroundEffect?: boolean;
}

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

// コンテンツが切り替わる際のアニメーション（コンポーネント内での使用）
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

// スタッガー効果のあるコンテナ（子要素をずらして表示）
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

// スタッガー効果の子要素
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
