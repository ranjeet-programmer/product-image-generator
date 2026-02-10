import { SelectOption } from '../types';

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Image Generation Limits
export const IMAGE_LIMITS = {
  MIN_IMAGES: 1,
  MAX_IMAGES: 4,
  DEFAULT_IMAGES: 1,
  DEFAULT_RESOLUTION: '1024x1024',
} as const;

// Form Options
export const CATEGORIES: SelectOption[] = [
  { value: 'clothing', label: 'Clothing' },
  { value: 'footwear', label: 'Footwear' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'home-decor', label: 'Home Decor' },
  { value: 'toy', label: 'Toy' },
  { value: 'other', label: 'Other' },
];

export const STYLES: SelectOption[] = [
  { value: 'studio', label: 'Studio' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'nature', label: 'Nature' },
  { value: 'urban', label: 'Urban' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'vintage', label: 'Vintage' },
];

export const ANGLES: SelectOption[] = [
  { value: 'front', label: 'Front View' },
  { value: 'side', label: 'Side View' },
  { value: 'back', label: 'Back View' },
  { value: 'top', label: 'Top View' },
  { value: 'bottom', label: 'Bottom View' },
  { value: '45_degree', label: '45 Degree' },
  { value: 'close_up', label: 'Close Up' },
  { value: 'wide', label: 'Wide Angle' },
  { value: 'eye_level', label: 'Eye Level' },
];

// UI Constants
export const UI_TEXT = {
  LOADING: 'Generating...',
  ERROR_GENERIC: 'Something went wrong while generating images. Please try again.',
  ERROR_NETWORK: 'Network error. Please check your connection and try again.',
  ERROR_TIMEOUT: 'Request timed out. Please try again.',
  NO_IMAGES: 'No images generated yet',
  NO_IMAGES_SUBTITLE: 'Fill out the form to start creating',
} as const;

// Validation
export const VALIDATION = {
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 500,
} as const;
