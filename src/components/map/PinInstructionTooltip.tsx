
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { MousePointer2, Smartphone, TouchpadOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Component that displays an animated tooltip instructing users how to add pins
 * First shows prominently in the center, then moves to a subtle corner position
 */
const PinInstructionTooltip: React.FC = () => {
  // States to control different animation phases
  const [centerVisible, setCenterVisible] = useState(true);
  const [cornerVisible, setCornerVisible] = useState(false);
  const { language } = useLanguage();
  const isMobile = useIsMobile();

  // Text based on current language
  const tooltipText = language === 'es' 
    ? 'Toque o haga clic derecho en el mapa para añadir un pin'
    : 'Tap or right-click on the map to add a pin';

  // Control animation sequence timing
  useEffect(() => {
    // Phase 1: Show center tooltip for 2 seconds
    const centerTimer = setTimeout(() => {
      setCenterVisible(false);
    }, 2000);
    
    // Phase 2: After center fades, show corner tooltip
    const cornerTimer = setTimeout(() => {
      setCornerVisible(true);
    }, 2500); // Add small delay between transitions

    return () => {
      clearTimeout(centerTimer);
      clearTimeout(cornerTimer);
    };
  }, []);

  // Animation variants for center tooltip
  const centerVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8 
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      scale: 1,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  // Animation variants for corner tooltip
  const cornerVariants = {
    hidden: { 
      opacity: 0,
      x: -10
    },
    visible: { 
      opacity: 0.7,
      x: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  // Use appropriate icon based on device
  const IconComponent = isMobile ? Smartphone : MousePointer2;

  return (
    <>
      {/* Center tooltip - prominent display but smaller */}
      <AnimatePresence>
        {centerVisible && (
          <motion.div 
            className="fixed z-[500] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-white shadow-md border border-gray-200 max-w-[85%] sm:max-w-xs"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={centerVariants}
          >
            <div className="flex items-center gap-2 font-medium text-gray-800 text-sm">
              <IconComponent className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>{tooltipText}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corner tooltip - more subtle */}
      <AnimatePresence>
        {cornerVisible && (
          <motion.div 
            className="fixed z-[500] left-4 bottom-4 px-2 py-1 rounded-lg bg-white/60 shadow-sm border border-gray-100"
            initial="hidden"
            animate="visible"
            variants={cornerVariants}
          >
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <IconComponent className="w-3 h-3 text-blue-400 flex-shrink-0" />
              <span className="truncate">{tooltipText}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PinInstructionTooltip;
