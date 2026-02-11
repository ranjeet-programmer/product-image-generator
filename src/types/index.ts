// Core type definitions for the product image generator

export type LogoType = 'none' | 'image' | 'text';

export type LogoPosition =
  | 'center'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'middle-left'
  | 'middle-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface LogoSettings {
  type: LogoType;
  content?: string;
  position: LogoPosition;
  size: number;
  opacity: number;
  rotation?: number;
  offsetX?: number;
  offsetY?: number;
  textColor?: string;
  fontFamily?: string;
  smartPositioning?: boolean;
}

export interface GenerateRequest {
  description: string;
  category: string;
  style: string;
  angle: string;
  color?: string;
  settings?: GenerateSettings;
  logo?: LogoSettings;
}

export interface GenerateSettings {
  numImages: number;
  resolution: string;
}

export interface GenerateResponse {
  success: boolean;
  images: GeneratedImage[];
  metadata: GenerationMetadata;
}

export interface GeneratedImage {
  url: string;
  filename: string;
}

export interface GenerationMetadata {
  prompt: string;
  settings: GenerateSettings;
}

// Error types
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

export class GenerationError extends Error {
  code?: string;
  details?: unknown;

  constructor(message: string, code?: string, details?: unknown) {
    super(message);
    this.name = 'GenerationError';
    this.code = code;
    this.details = details;
  }
}

// Form option types
export interface SelectOption {
  value: string;
  label: string;
}

// Image state types
export interface ImageLoadState {
  url: string;
  loaded: boolean;
  error: boolean;
}
