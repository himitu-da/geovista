
import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { ButtonAnimation } from '@/components/animations/ButtonAnimation';

interface GenerateButtonProps {
  loading: boolean;
  disabled: boolean;
  onClick: () => void;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  loading,
  disabled,
  onClick
}) => {
  return (
    <ButtonAnimation>
      <button
        onClick={onClick}
        disabled={loading || disabled}
        className="text-xs bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-1.5 px-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      >
        {loading ? (
          <span className="flex items-center">
            <Loader2 className="animate-spin h-3 w-3 mr-1.5" /> 
            生成中...
          </span>
        ) : (
          <span className="flex items-center">
            <Sparkles className="h-3 w-3 mr-1.5" />
            インサイトを生成
          </span>
        )}
      </button>
    </ButtonAnimation>
  );
};
