import { GeneratedImage } from '../types';
import { API_CONFIG } from '../config';

/**
 * Extracts the backend origin from the API URL
 */
export const getBackendOrigin = (): string => {
  const apiUrl = API_CONFIG.BASE_URL;
  try {
    const url = new URL(apiUrl);
    return url.origin;
  } catch {
    // Fallback for relative URLs or invalid URLs
    return apiUrl.replace('/api', '');
  }
};

/**
 * Processes image URLs from the API response
 * Converts relative URLs to absolute URLs using the backend origin
 */
export const processImageUrls = (images: (string | GeneratedImage)[]): string[] => {
  const backendOrigin = getBackendOrigin();
  
  return images.map(imgData => {
    // Handle both string paths (legacy) and object paths (current)
    const imgPath = typeof imgData === 'string' ? imgData : imgData.url;
    
    // Return as-is if already absolute URL
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
      return imgPath;
    }
    
    // Prepend backend origin for relative URLs
    return `${backendOrigin}${imgPath}`;
  });
};

/**
 * Validates if a URL is a valid image URL
 */
export const validateImageUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Creates a download link for an image
 */
export const downloadImage = (url: string, filename?: string): void => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `product-image-${Date.now()}.png`;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Preloads an image to cache it
 */
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};
