export interface GenerateRequest {
  description: string;
  category: string;
  style: string;
  angle: string;
  color?: string;
  settings?: {
    numImages: number;
    resolution: string;
  };
}

export interface GenerateResponse {
  success: boolean;
  images: { url: string; filename: string }[];
  metadata: {
    prompt: string;
    settings: any;
  };
}

const API_Base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const generateImages = async (data: GenerateRequest): Promise<GenerateResponse> => {
  const response = await fetch(`${API_Base_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate images');
  }

  return response.json();
};
