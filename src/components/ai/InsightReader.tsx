
import React from 'react';
import { MicIcon } from 'lucide-react';

interface InsightReaderProps {
  insight: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const InsightReader: React.FC<InsightReaderProps> = ({
  insight,
  isPlaying,
  onTogglePlay
}) => {
  if (!insight) return null;
  
  return (
    <button
      onClick={onTogglePlay}
      className="flex items-center text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-1 px-2 rounded transition-colors"
    >
      <MicIcon className="h-3 w-3 mr-1" />
      {isPlaying ? 'Pause' : 'Listen'}
    </button>
  );
};

export default InsightReader;
