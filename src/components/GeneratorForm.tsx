import React, { useState, useCallback } from 'react';
import { Camera, Layers, Palette, Maximize, Sparkles, Image as ImageIcon } from 'lucide-react';
import { GenerateRequest } from '../types';
import { CATEGORIES, STYLES, ANGLES, IMAGE_LIMITS } from '../config';
import { FormSelect } from './FormSelect';
import { LoadingSpinner } from './LoadingSpinner';

interface GeneratorFormProps {
  onSubmit: (data: GenerateRequest) => void;
  isLoading: boolean;
}

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<GenerateRequest>({
    description: '',
    category: 'clothing',
    style: 'studio',
    angle: 'front',
    color: '',
    settings: {
      numImages: IMAGE_LIMITS.DEFAULT_IMAGES,
      resolution: IMAGE_LIMITS.DEFAULT_RESOLUTION,
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    },
    [formData, onSubmit]
  );

  const handleChange = useCallback((field: keyof GenerateRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSettingsChange = useCallback(
    (field: 'numImages' | 'resolution', value: number | string) => {
      setFormData((prev) => ({
        ...prev,
        settings: {
          ...prev.settings!,
          [field]: value,
        },
      }));
    },
    []
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6"
    >
      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          Product Description
        </label>
        <textarea
          required
          rows={4}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none outline-none"
          placeholder="Describe your product in detail (e.g., 'A modern ergonomic office chair in black mesh...')"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <FormSelect
          label="Category"
          icon={<Layers size={16} />}
          value={formData.category}
          options={CATEGORIES}
          onChange={(value) => handleChange('category', value)}
        />

        {/* Style */}
        <FormSelect
          label="Style"
          icon={<Palette size={16} />}
          value={formData.style}
          options={STYLES}
          onChange={(value) => handleChange('style', value)}
        />

        {/* Angle */}
        <FormSelect
          label="Angle"
          icon={<Camera size={16} />}
          value={formData.angle}
          options={ANGLES}
          onChange={(value) => handleChange('angle', value)}
        />

        {/* Color */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Sparkles size={16} /> Color
          </label>
          <input
            type="text"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="e.g. Navy Blue, Matte Black"
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
          />
        </div>

        {/* Number of Images */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <ImageIcon size={16} /> Quantity
          </label>
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5">
            <input
              type="range"
              min={IMAGE_LIMITS.MIN_IMAGES}
              max={IMAGE_LIMITS.MAX_IMAGES}
              step="1"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              value={formData.settings?.numImages || IMAGE_LIMITS.DEFAULT_IMAGES}
              onChange={(e) =>
                handleSettingsChange('numImages', parseInt(e.target.value))
              }
            />
            <span className="font-semibold text-slate-900 w-8 text-center">
              {formData.settings?.numImages || IMAGE_LIMITS.DEFAULT_IMAGES}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ImageIcon size={16} />
          <span>
            Generates {formData.settings?.numImages || IMAGE_LIMITS.DEFAULT_IMAGES} high-res image
            {(formData.settings?.numImages || IMAGE_LIMITS.DEFAULT_IMAGES) > 1 ? 's' : ''}
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading || !formData.description.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/25"
        >
          {isLoading ? (
            <LoadingSpinner size="sm" text="Generating..." />
          ) : (
            <>
              <Maximize size={18} /> Generate Image
            </>
          )}
        </button>
      </div>
    </form>
  );
};

