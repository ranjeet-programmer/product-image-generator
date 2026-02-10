import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 32,
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2 size={sizeMap[size]} className="animate-spin" />
      {text && <span className="text-sm">{text}</span>}
    </div>
  );
};
