import React, { useState } from 'react';
import { Download, AlertCircle } from 'lucide-react';

interface ImageCardProps {
  url: string;
  index: number;
  onError?: (index: number) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ url, index, onError }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    setHasError(true);
    onError?.(index);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  if (hasError) {
    return (
      <div className="aspect-square rounded-xl overflow-hidden bg-red-50 border border-red-200 flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="text-red-400 mb-2" size={32} />
        <p className="text-sm text-red-600 font-medium">Failed to load image</p>
        <p className="text-xs text-red-500 mt-1">Please try generating again</p>
      </div>
    );
  }

  return (
    <div className="group relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200">
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center">
          <span className="text-slate-400 text-sm">Loading...</span>
        </div>
      )}
      <img
        src={url}
        alt={`Generated product ${index + 1}`}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-end p-4 opacity-0 group-hover:opacity-100">
        <a
          href={url}
          download
          target="_blank"
          rel="noreferrer"
          className="p-2 bg-white rounded-full shadow-lg hover:bg-slate-50 text-slate-900 transition-transform hover:scale-110"
          title="Download Image"
          aria-label={`Download image ${index + 1}`}
        >
          <Download size={20} />
        </a>
      </div>
    </div>
  );
};
