
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  isGlobeParticle?: boolean;
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
  const particleCount = 90; // パーティクル数を増やす
  const mouseRef = useRef({ x: 0, y: 0 });
  const isMouseMovingRef = useRef(false);
  const mouseMovingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const globeRef = useRef<{x: number, y: number, radius: number} | null>(null);

  // よりグローバルな印象を与えるカラーパレット
  const colorPalette = [
    'rgba(79, 114, 255, opacity)',  // ブルー
    'rgba(46, 82, 218, opacity)',   // ミディアムブルー
    'rgba(14, 52, 190, opacity)',   // ディープブルー
    'rgba(0, 128, 128, opacity)',   // ティール
    'rgba(0, 150, 100, opacity)'    // グリーン
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスサイズの設定
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // 中央に地球を配置
      globeRef.current = {
        x: canvas.width * 0.85,
        y: canvas.height * 0.5,
        radius: Math.min(canvas.width, canvas.height) * 0.15
      };
    };

    // 初期パーティクルの生成
    const createParticles = () => {
      particlesRef.current = [];
      
      // 通常のパーティクル
      for (let i = 0; i < particleCount; i++) {
        const opacity = Math.random() * 0.6 + 0.2;
        const colorIndex = Math.floor(Math.random() * colorPalette.length);
        const color = colorPalette[colorIndex].replace('opacity', opacity.toString());
        
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity,
          color
        });
      }
      
      // 地球の周りを回るパーティクル
      if (globeRef.current) {
        const globe = globeRef.current;
        const orbitParticleCount = 30;
        
        for (let i = 0; i < orbitParticleCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const distance = globe.radius * (1 + Math.random() * 0.5);
          const opacity = Math.random() * 0.8 + 0.2;
          
          particlesRef.current.push({
            x: globe.x + Math.cos(angle) * distance,
            y: globe.y + Math.sin(angle) * distance,
            size: Math.random() * 2 + 0.8,
            speedX: Math.cos(angle) * 0.2,
            speedY: Math.sin(angle) * 0.2,
            opacity,
            color: 'rgba(255, 255, 255, opacity)'.replace('opacity', opacity.toString()),
            isGlobeParticle: true
          });
        }
      }
    };

    // パーティクルの描画と更新
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 地球の描画
      if (globeRef.current) {
        const globe = globeRef.current;
        
        // 地球の背景グロー
        const gradient = ctx.createRadialGradient(
          globe.x, globe.y, 0,
          globe.x, globe.y, globe.radius * 1.5
        );
        gradient.addColorStop(0, 'rgba(14, 52, 190, 0.15)');
        gradient.addColorStop(1, 'rgba(14, 52, 190, 0)');
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(globe.x, globe.y, globe.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // 地球本体
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(79, 114, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.arc(globe.x, globe.y, globe.radius, 0, Math.PI * 2);
        ctx.stroke();
        
        // 地球の経線と緯線
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI;
          
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(79, 114, 255, 0.05)';
          ctx.lineWidth = 0.5;
          
          // 経線
          ctx.beginPath();
          ctx.arc(globe.x, globe.y, globe.radius, 0, Math.PI * 2, false);
          ctx.stroke();
          
          // 緯線
          ctx.beginPath();
          ctx.moveTo(globe.x - globe.radius, globe.y);
          ctx.lineTo(globe.x + globe.radius, globe.y);
          ctx.stroke();
          
          // 縦線
          ctx.beginPath();
          ctx.moveTo(globe.x, globe.y - globe.radius);
          ctx.lineTo(globe.x, globe.y + globe.radius);
          ctx.stroke();
          
          // 斜め線
          ctx.beginPath();
          ctx.moveTo(
            globe.x + Math.cos(angle) * globe.radius,
            globe.y + Math.sin(angle) * globe.radius
          );
          ctx.lineTo(
            globe.x - Math.cos(angle) * globe.radius,
            globe.y - Math.sin(angle) * globe.radius
          );
          ctx.stroke();
        }
      }
      
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

        // 特別な処理: 地球の周りを回るパーティクル
        if (particle.isGlobeParticle && globeRef.current) {
          const globe = globeRef.current;
          const dx = particle.x - globe.x;
          const dy = particle.y - globe.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          
          // 地球を中心に円軌道を描く
          const targetX = globe.x + Math.cos(angle + 0.01) * distance;
          const targetY = globe.y + Math.sin(angle + 0.01) * distance;
          
          particle.x = targetX;
          particle.y = targetY;
          
          // 軌道の半径を徐々に変化させる
          const orbitChange = Math.sin(Date.now() * 0.001) * 0.3;
          const targetDistance = globe.radius * (1 + Math.random() * 0.5 + orbitChange);
          
          // 軌道の補正
          const currentDistance = Math.sqrt(
            (particle.x - globe.x) ** 2 + (particle.y - globe.y) ** 2
          );
          
          if (Math.abs(currentDistance - targetDistance) > 5) {
            const correctionFactor = 0.02;
            const correctionX = (targetDistance / currentDistance - 1) * (particle.x - globe.x) * correctionFactor;
            const correctionY = (targetDistance / currentDistance - 1) * (particle.y - globe.y) * correctionFactor;
            
            particle.x += correctionX;
            particle.y += correctionY;
          }
        } else {
          // 通常のパーティクルの移動
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
        }
        
        // パーティクルの描画
        ctx.beginPath();
        ctx.fillStyle = particle.color;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // パーティクル間の接続線を描画
        particlesRef.current.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = particle.isGlobeParticle || otherParticle.isGlobeParticle ? 60 : 120;
            
            if (distance < maxDistance) {
              ctx.beginPath();
              const alpha = particle.isGlobeParticle || otherParticle.isGlobeParticle
                ? 0.3 * (1 - distance / maxDistance)
                : 0.25 * (1 - distance / maxDistance);
              
              ctx.strokeStyle = `rgba(79, 114, 255, ${alpha})`;
              ctx.lineWidth = 0.7;
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
      className="fixed inset-0 z-0 opacity-40 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      transition={{ duration: 1.5 }}
    />
  );
};

export default ParticleBackground;
