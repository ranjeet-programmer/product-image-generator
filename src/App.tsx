import { useState, useCallback } from 'react';
import { GeneratorForm } from './components/GeneratorForm';
import { ImageGallery } from './components/ImageGallery';
import { ErrorMessage } from './components/ErrorMessage';
import { generateImages } from './api/generate';
import { GenerateRequest, GenerationError } from './types';
import { processImageUrls } from './utils/imageUtils';
import { Sparkles, ShoppingBag } from 'lucide-react';

function App() {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (data: GenerateRequest) => {
    setIsLoading(true);
    setError(null);
    setImages([]);

    try {
      const response = await generateImages(data);
      if (response.success && response.images.length > 0) {
        const fullUrls = processImageUrls(response.images);
        setImages(fullUrls);
      }
    } catch (err) {
      console.error('Generation error:', err);
      
      if (err instanceof GenerationError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDismissError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 mb-4">
            <ShoppingBag className="text-white h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
            Product Image Generator
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Generate professional product photos instantly using AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
            <div className="bg-white rounded-2xl p-1 shadow-sm border border-slate-200">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-600" />
                  Configuration
                </h2>
              </div>
              <div className="p-1">
                <GeneratorForm onSubmit={handleGenerate} isLoading={isLoading} />
              </div>
            </div>

            {error && (
              <ErrorMessage
                message={error}
                type="error"
                dismissible
                onDismiss={handleDismissError}
              />
            )}
          </div>

          {/* Right Column: Gallery */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 min-h-[600px]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">Generated Results</h2>
                {images.length > 0 && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Success
                  </span>
                )}
              </div>

              <ImageGallery images={images} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

