
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

/**
 * マウス操作に反応するさざ波エフェクトコンポーネント
 * ユーザーインタラクションに優雅なビジュアルフィードバックを提供
 */
const RippleEffect: React.FC = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);
  const throttleRef = useRef(false);
  
  useEffect(() => {
    // マウスの動きを追跡
    const handleMouseMove = (e: MouseEvent) => {
      if (throttleRef.current) return;
      
      // パフォーマンスのためにスロットル処理
      throttleRef.current = true;
      setTimeout(() => {
        throttleRef.current = false;
      }, 50);
      
      // 新しいさざ波を作成
      const newRipple = {
        id: rippleIdRef.current++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 20 + 30, // 30〜50pxのランダムなサイズ
      };
      
      setRipples((prev) => [...prev, newRipple]);
      
      // 1秒後にさざ波を削除
      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
      }, 1000);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ opacity: 0.5, scale: 0 }}
            animate={{ 
              opacity: 0, 
              scale: 1,
              background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(79,114,255,0.1) 70%, rgba(0,0,0,0) 100%)' 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default RippleEffect;
