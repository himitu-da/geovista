
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureListItemProps {
  icon: React.ReactNode;
  text: string;
}

/**
 * Feature list item component
 * Display feature details in a list
 */
export const FeatureListItem: React.FC<FeatureListItemProps> = ({ icon, text }) => {
  const fadeIn = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };
  
  return (
    <motion.li 
      className="flex items-start"
      variants={fadeIn}
    >
      <div className="bg-blue-100 rounded-full p-1.5 mr-3 mt-1 shadow-sm">
        {icon}
      </div>
      <span className="text-lg text-apple-gray-600">{text}</span>
    </motion.li>
  );
};
