
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

/**
 * パーティクルアニメーション背景コンポーネント
 * インタラクティブな背景アニメーションを提供し、
 * LPに深みと洗練された印象を与える
 */
const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  // パーティクル数とマウス位置の状態
  const particleCount = 80;
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMouseMovingRef = useRef(false);
  const mouseMovingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスサイズの設定
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // 初期パーティクルの生成
    const createParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    };

    // パーティクルの描画と更新
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // パーティクルの更新と描画
      particlesRef.current.forEach((particle, index) => {
        // マウスインタラクション
        if (isMouseMovingRef.current) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;
          
          if (distance < maxDistance) {
            const force = (1 - distance / maxDistance) * 0.5;
            particle.speedX -= (dx / distance) * force;
            particle.speedY -= (dy / distance) * force;
          }
        }

        // パーティクルの移動
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // 画面端での反射
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1;
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1;
        }
        
        // 速度の減衰
        particle.speedX *= 0.99;
        particle.speedY *= 0.99;
        
        // パーティクルの描画
        ctx.beginPath();
        ctx.fillStyle = `rgba(101, 130, 255, ${particle.opacity})`;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // パーティクル間の接続線を描画
        particlesRef.current.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(101, 130, 255, ${0.15 * (1 - distance / 120)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
            }
          }
        });
      });
      
      animationRef.current = requestAnimationFrame(render);
    };
    
    // マウス移動のイベントハンドラ
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      isMouseMovingRef.current = true;
      
      // 一定時間経過後にマウス移動の影響を弱める
      if (mouseMovingTimeoutRef.current) {
        clearTimeout(mouseMovingTimeoutRef.current);
      }
      
      mouseMovingTimeoutRef.current = setTimeout(() => {
        isMouseMovingRef.current = false;
      }, 100);
    };

    // 初期化とイベントリスナー設定
    setCanvasSize();
    createParticles();
    render();
    
    window.addEventListener('resize', () => {
      setCanvasSize();
      createParticles();
    });
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // クリーンアップ
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseMovingTimeoutRef.current) {
        clearTimeout(mouseMovingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-30 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 1.5 }}
    />
  );
};

export default ParticleBackground;
