
import React from 'react';
import { motion } from 'framer-motion';

interface ButtonAnimationProps {
  children: React.ReactNode;
}

export const ButtonAnimation: React.FC<ButtonAnimationProps> = ({ children }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.div>
  );
};
