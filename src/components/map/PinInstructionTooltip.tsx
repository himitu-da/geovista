
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { MousePointer2, Smartphone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * ユーザーにピン追加方法を表示する左下のツールチップコンポーネント
 */
const PinInstructionTooltip: React.FC = () => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  // 翻訳テキストを取得
  const tooltipText = t('addPin');

  // デバイスに適したアイコンを使用
  const IconComponent = isMobile ? Smartphone : MousePointer2;

  // アニメーションバリアント
  const tooltipVariants = {
    initial: { 
      opacity: 0,
      y: 10,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    },
    highlight: {
      scale: [1, 1.05, 1],
      boxShadow: [
        "0 1px 2px rgba(0,0,0,0.1)",
        "0 4px 8px rgba(0,0,0,0.15)",
        "0 1px 2px rgba(0,0,0,0.1)"
      ],
      transition: {
        duration: 1.2,
        times: [0, 0.5, 1],
        ease: "easeInOut",
        delay: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="fixed z-[500] left-4 bottom-4 px-3 py-2 rounded-lg bg-white/90 shadow-md border border-gray-200"
      initial="initial"
      animate={["visible", "highlight"]}
      variants={tooltipVariants}
    >
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <IconComponent className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <span>{tooltipText}</span>
      </div>
    </motion.div>
  );
};

export default PinInstructionTooltip;
