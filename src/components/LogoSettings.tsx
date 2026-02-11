import { useState, ChangeEvent } from 'react';
import { Upload, Type, X } from 'lucide-react';
import { LogoSettings, LogoType, LogoPosition } from '../types';

interface LogoSettingsProps {
  settings: LogoSettings;
  onChange: (settings: LogoSettings) => void;
}

const POSITION_OPTIONS: { value: LogoPosition; label: string }[] = [
  { value: 'center', label: 'Center' },
  { value: 'top-left', label: 'Top Left' },
  { value: 'top-center', label: 'Top Center' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'middle-left', label: 'Middle Left' },
  { value: 'middle-right', label: 'Middle Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'bottom-center', label: 'Bottom Center' },
  { value: 'bottom-right', label: 'Bottom Right' },
];

export function LogoSettingsComponent({ settings, onChange }: LogoSettingsProps) {
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const handleTypeChange = (type: LogoType) => {
    onChange({ ...settings, type, content: '' });
    setLogoPreview('');
  };

  const handleLogoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert('Logo file must be less than 2MB');
      return;
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PNG, JPG, or SVG file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('logo', file);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/upload-logo`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      const data = await response.json();
      
      // Set logo preview and update settings with filename
      setLogoPreview(URL.createObjectURL(file));
      onChange({ ...settings, content: data.filename });
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleTextChange = (text: string) => {
    onChange({ ...settings, content: text });
  };

  const clearLogo = () => {
    setLogoPreview('');
    onChange({ ...settings, content: '' });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo Type
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleTypeChange('none')}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all ${
              settings.type === 'none'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            None
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('image')}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
              settings.type === 'image'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Upload className="w-4 h-4" />
            Image
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('text')}
            className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all flex items-center justify-center gap-2 ${
              settings.type === 'text'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Type className="w-4 h-4" />
            Text
          </button>
        </div>
      </div>

      {settings.type === 'image' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Logo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {logoPreview ? (
              <div className="relative">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="max-h-32 mx-auto"
                />
                <button
                  type="button"
                  onClick={clearLogo}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                  disabled={uploading}
                />
                <label
                  htmlFor="logo-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    {uploading ? 'Uploading...' : 'Click to upload logo'}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    PNG, JPG, or SVG (max 2MB)
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {settings.type === 'text' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Watermark Text
          </label>
          <input
            type="text"
            value={settings.content || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter text (e.g., MyBrand.com)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {settings.type !== 'none' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position
            </label>
            <select
              value={settings.position}
              onChange={(e) => onChange({ ...settings, position: e.target.value as LogoPosition })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {POSITION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smartPositioning || false}
                onChange={(e) => onChange({ ...settings, smartPositioning: e.target.checked })}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <div>
                <div className="text-sm font-medium text-blue-900">
                  Smart Positioning (AI-powered)
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  Uses object detection to position logo relative to the product instead of the image edges
                </div>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size: {settings.size}%
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={settings.size}
              onChange={(e) => onChange({ ...settings, size: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            < div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opacity: {settings.opacity}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.opacity}
              onChange={(e) => onChange({ ...settings, opacity: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Transparent</span>
              <span>Opaque</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rotation (degrees)
            </label>
            <input
              type="number"
              min="-360"
              max="360"
              value={settings.rotation || 0}
              onChange={(e) => onChange({ ...settings, rotation: parseInt(e.target.value) || 0 })}
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </>
      )}
    </div>
  );
}
