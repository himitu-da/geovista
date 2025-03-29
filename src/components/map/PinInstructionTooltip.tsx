
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { MousePointer2 } from 'lucide-react';

/**
 * Component that displays an animated tooltip instructing users how to add pins
 */
const PinInstructionTooltip: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const { language } = useLanguage();

  // Automatically hide the tooltip after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 1500);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  const tooltipText = language === 'es' 
    ? 'Haga clic derecho en el mapa para añadir un pin'
    : 'Right-click on the map to add a pin';

  const centerVariants = {
    center: {
      scale: 1.2,
      opacity: 1,
      x: '-50%',
      y: '-50%',
      left: '50%',
      top: '50%',
      transition: { duration: 0.5 }
    },
    corner: {
      scale: 0.7,
      opacity: 0.9,
      left: '10px',
      top: 'unset',
      x: 0,
      y: 0,
      bottom: '40px',
      transition: { 
        duration: 0.8,
        delay: 1,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed z-[500] px-4 py-2 rounded-lg bg-white/90 shadow-lg border border-gray-200"
          initial="center"
          animate={isAnimating ? "center" : "corner"}
          exit="exit"
          variants={centerVariants}
        >
          <div className="flex items-center gap-2 font-medium text-gray-800">
            <MousePointer2 className="w-4 h-4 text-blue-500" />
            <span>{tooltipText}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PinInstructionTooltip;
