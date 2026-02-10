import React, { useCallback } from 'react';
import { ImageCard } from './ImageCard';
import { UI_TEXT } from '../config';

interface ImageGalleryProps {
  images: string[];
  isLoading: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isLoading }) => {
  const handleImageError = useCallback((index: number) => {
    console.error(`Failed to load image at index ${index}`);
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-slate-200 animate-pulse flex items-center justify-center"
          >
            <div className="text-slate-400 font-medium">{UI_TEXT.LOADING}</div>
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-100/50 rounded-xl border border-dashed border-slate-300">
        <p className="font-medium">{UI_TEXT.NO_IMAGES}</p>
        <p className="text-sm">{UI_TEXT.NO_IMAGES_SUBTITLE}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-in fade-in duration-700">
      {images.map((url, index) => (
        <ImageCard
          key={`${url}-${index}`}
          url={url}
          index={index}
          onError={handleImageError}
        />
      ))}
    </div>
  );
};

