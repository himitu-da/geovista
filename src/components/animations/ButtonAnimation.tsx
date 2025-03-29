
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonAnimationProps {
  children: React.ReactNode;
  delay?: number;
  type?: 'bounce' | 'pulse' | 'scale' | 'glow';
}

export const ButtonAnimation: React.FC<ButtonAnimationProps> = ({ 
  children, 
  delay = 0,
  type = 'scale' 
}) => {
  // アニメーションタイプに基づいた設定
  const animations = {
    bounce: {
      whileHover: { y: -5, transition: { duration: 0.2, type: 'spring', stiffness: 500 } },
      whileTap: { y: 2, scale: 0.95, transition: { type: 'spring', stiffness: 300 } },
      initial: { y: 0 },
    },
    pulse: {
      whileHover: { 
        scale: [1, 1.05, 1.03],
        transition: { 
          duration: 0.4, 
          repeat: Infinity, 
          repeatType: 'reverse' as const,
        } 
      },
      whileTap: { scale: 0.95 },
      initial: { scale: 1 },
    },
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      initial: { scale: 1 },
    },
    glow: {
      whileHover: { 
        boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
        scale: 1.03,
      },
      whileTap: { scale: 0.97, boxShadow: '0 0 0px rgba(59, 130, 246, 0)' },
      initial: { boxShadow: '0 0 0px rgba(59, 130, 246, 0)', scale: 1 },
    }
  };

  return (
    <motion.div
      {...animations[type]}
      initial={{ opacity: 0, y: 10, ...animations[type].initial }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        ...animations[type].initial,
        transition: { delay, duration: 0.3 } 
      }}
    >
      {children}
    </motion.div>
  );
};

// 追加: ホバー時のエフェクトが異なる高度なボタンアニメーション
export const AdvancedButtonAnimation: React.FC<ButtonAnimationProps & { className?: string }> = ({
  children,
  delay = 0,
  className = '',
}) => {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { delay, duration: 0.3 } 
      }}
      whileHover="hover"
      whileTap="tap"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 pointer-events-none rounded-md"
        initial={{ opacity: 0 }}
        variants={{
          hover: { 
            opacity: 1,
            transition: { duration: 0.2 }
          },
          tap: { 
            opacity: 0.8,
            scale: 0.98
          }
        }}
      />
      <motion.div
        variants={{
          hover: { y: -3, transition: { duration: 0.2 } },
          tap: { y: 1, scale: 0.98, transition: { duration: 0.1 } }
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// 追加: 円形に広がるリップルエフェクト付きボタン
export const RippleButtonAnimation: React.FC<{ children: React.ReactNode, className?: string }> = ({ 
  children,
  className = ''
}) => {
  const [ripple, setRipple] = React.useState<{ x: number, y: number, active: boolean }>({ 
    x: 0, 
    y: 0, 
    active: false 
  });
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRipple({ x, y, active: true });
  };
  
  const handleAnimationEnd = () => {
    setRipple(prev => ({ ...prev, active: false }));
  };
  
  return (
    <motion.div 
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onMouseDown={handleMouseDown}
    >
      {ripple.active && (
        <motion.span
          className="absolute bg-white/30 rounded-full pointer-events-none"
          initial={{ 
            width: 0, 
            height: 0, 
            x: ripple.x, 
            y: ripple.y,
            opacity: 0.6
          }}
          animate={{ 
            width: [0, 200], 
            height: [0, 200], 
            x: ripple.x - 100, 
            y: ripple.y - 100, 
            opacity: [0.6, 0]
          }}
          transition={{ duration: 0.7 }}
          onAnimationComplete={handleAnimationEnd}
        />
      )}
      {children}
    </motion.div>
  );
};
