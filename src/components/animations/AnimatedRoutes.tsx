
import React from 'react';
import { Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const directionOffset = 200;

/**
 * ルート全体にアニメーションを適用するラッパーコンポーネント
 * ページ遷移時のスライドアニメーションを管理
 */
export const AnimatedRoutes: React.FC<{ 
  children: React.ReactNode 
}> = ({ children }) => {
  const location = useLocation();
  const [prevPath, setPrevPath] = React.useState(location.pathname);
  const [transitionDirection, setTransitionDirection] = React.useState<'left' | 'right'>('right');
  
  // パスの履歴に基づいて遷移方向を決定
  React.useEffect(() => {
    if (location.pathname !== prevPath) {
      // ルート階層の深さや特定のパターンに基づいて方向を決定できます
      // 例: メインページからサブページへの遷移は右方向、戻る場合は左方向
      if (prevPath === '/' && location.pathname !== '/') {
        setTransitionDirection('right');
      } else if (prevPath !== '/' && location.pathname === '/') {
        setTransitionDirection('left');
      } else if (location.pathname.length < prevPath.length) {
        setTransitionDirection('left');
      } else {
        setTransitionDirection('right');
      }
      
      setPrevPath(location.pathname);
    }
  }, [location.pathname, prevPath]);
  
  // 方向に応じたアニメーションバリアント
  const getVariants = () => {
    return {
      initial: { 
        opacity: 0,
        x: transitionDirection === 'right' ? directionOffset : -directionOffset,
        scale: 0.96,
      },
      animate: { 
        opacity: 1, 
        x: 0,
        scale: 1,
        transition: {
          duration: 0.3,
          ease: [0.25, 1, 0.5, 1],
        }
      },
      exit: { 
        opacity: 0,
        x: transitionDirection === 'right' ? -directionOffset : directionOffset,
        scale: 0.96,
        transition: {
          duration: 0.2,
          ease: [0.25, 1, 0.5, 1],
        }
      }
    };
  };
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* メインコンテンツのアニメーション - AnimatePresenceのmodeをwaitからsyncに変更し、initialをtrueに */}
      <AnimatePresence mode="sync" initial={true}>
        <motion.div
          key={location.pathname}
          variants={getVariants()}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full h-full absolute inset-0"
        >
          <Routes location={location}>
            {children}
          </Routes>
        </motion.div>
      </AnimatePresence>
      
      {/* 背景エフェクトのシンプル化 */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10" 
             style={{ 
               filter: 'blur(80px)',
               transform: 'translate(-10%, -10%) scale(1.2)',
             }} 
        />
      </div>
    </div>
  );
};

// より単純なバージョン（必要に応じて使用）
export const SimpleAnimatedRoutes: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="sync" initial={false}>
      <Routes location={location} key={location.pathname}>
        {children}
      </Routes>
    </AnimatePresence>
  );
};
