import { GenerateRequest, GenerateResponse, GenerationError } from '../types';
import { API_CONFIG, UI_TEXT } from '../config';

/**
 * Creates an AbortController with timeout
 */
const createTimeoutController = (timeoutMs: number): AbortController => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
};

/**
 * Generates images based on the request data
 * Includes timeout handling and proper error types
 */
export const generateImages = async (
  data: GenerateRequest
): Promise<GenerateResponse> => {
  const controller = createTimeoutController(API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new GenerationError(
        errorData.error || 'Failed to generate images',
        `HTTP_${response.status}`,
        errorData
      );
    }

    return response.json();
  } catch (error) {
    // Handle different error types
    if (error instanceof GenerationError) {
      throw error;
    }

    if (error instanceof Error) {
      // Handle abort/timeout
      if (error.name === 'AbortError') {
        throw new GenerationError(UI_TEXT.ERROR_TIMEOUT, 'TIMEOUT');
      }

      // Handle network errors
      if (error.message.includes('fetch')) {
        throw new GenerationError(UI_TEXT.ERROR_NETWORK, 'NETWORK_ERROR');
      }
    }

    // Generic error fallback
    throw new GenerationError(
      UI_TEXT.ERROR_GENERIC,
      'UNKNOWN_ERROR',
      error
    );
  }
};

// Re-export types for convenience
export type { GenerateRequest, GenerateResponse };

