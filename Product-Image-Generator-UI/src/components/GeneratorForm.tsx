import React, { useState } from 'react';
import { Camera, Layers, Palette, Maximize, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { GenerateRequest } from '../api/generate';

interface GeneratorFormProps {
  onSubmit: (data: GenerateRequest) => void;
  isLoading: boolean;
}

const CATEGORIES = [
  { value: 'clothing', label: 'Clothing' },
  { value: 'footwear', label: 'Footwear' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'home-decor', label: 'Home Decor' },
  { value: 'toy', label: 'Toy' },
  { value: 'other', label: 'Other' }
];

const STYLES = [
  { value: 'studio', label: 'Studio' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'nature', label: 'Nature' },
  { value: 'urban', label: 'Urban' },
  { value: 'minimalist', label: 'Minimalist' },
  { value: 'vintage', label: 'Vintage' }
];

const ANGLES = [
  { value: 'front', label: 'Front View' },
  { value: 'side', label: 'Side View' },
  { value: 'back', label: 'Back View' },
  { value: 'top', label: 'Top View' },
  { value: 'bottom', label: 'Bottom View' },
  { value: '45_degree', label: '45 Degree' },
  { value: 'close_up', label: 'Close Up' },
  { value: 'wide', label: 'Wide Angle' },
  { value: 'eye_level', label: 'Eye Level' }
];

export const GeneratorForm: React.FC<GeneratorFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<GenerateRequest>({
    description: '',
    category: 'clothing',
    style: 'studio',
    angle: 'front',
    color: '',
    settings: {
      numImages: 1,
      resolution: '1024x1024'
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof GenerateRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingsChange = (field: 'numImages' | 'resolution', value: any) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings!,
        [field]: value
      }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
      
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
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Layers size={16} /> Category
          </label>
          <select
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Style */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Palette size={16} /> Style
          </label>
          <select
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={formData.style}
            onChange={(e) => handleChange('style', e.target.value)}
          >
            {STYLES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Angle */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Camera size={16} /> Angle
          </label>
          <select
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={formData.angle}
            onChange={(e) => handleChange('angle', e.target.value)}
          >
            {ANGLES.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

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
              min="1"
              max="4"
              step="1"
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              value={formData.settings?.numImages || 1}
              onChange={(e) => handleSettingsChange('numImages', parseInt(e.target.value))}
            />
            <span className="font-semibold text-slate-900 w-8 text-center">
              {formData.settings?.numImages || 1}
            </span>
          </div>
        </div>

      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <ImageIcon size={16} />
          <span>Generates {formData.settings?.numImages || 1} high-res image{(formData.settings?.numImages || 1) > 1 ? 's' : ''}</span>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !formData.description.trim()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/25"
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Generating...
            </>
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
