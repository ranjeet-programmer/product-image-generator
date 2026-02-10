import React from 'react';
import { SelectOption } from '../types';

interface FormSelectProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  icon,
  value,
  options,
  onChange,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
        {icon}
        {label}
      </label>
      <select
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
