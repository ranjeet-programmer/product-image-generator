import React from 'react';
import { Download } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  isLoading: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {[1, 2, 3].map((i) => (
          <div key={i} className="aspect-square rounded-xl bg-slate-200 animate-pulse-slow flex items-center justify-center">
            <div className="text-slate-400 font-medium">Generating...</div>
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-100/50 rounded-xl border border-dashed border-slate-300">
        <p className="font-medium">No images generated yet</p>
        <p className="text-sm">Fill out the form to start creating</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-in fade-in duration-700">
      {images.map((url, index) => (
        <div key={index} className="group relative aspect-square rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200">
          <img 
            src={url} 
            alt={`Generated product ${index + 1}`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end justify-end p-4 opacity-0 group-hover:opacity-100">
            <a 
              href={url} 
              download 
              target="_blank"
              rel="noreferrer"
              className="p-2 bg-white rounded-full shadow-lg hover:bg-slate-50 text-slate-900 transition-transform hover:scale-110"
              title="Download Image"
            >
              <Download size={20} />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};
