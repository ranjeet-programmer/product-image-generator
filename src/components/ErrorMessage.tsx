import React from 'react';
import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

type ErrorType = 'error' | 'warning' | 'info';

interface ErrorMessageProps {
  message: string;
  type?: ErrorType;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const iconMap = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const styleMap = {
  error: 'bg-red-50 text-red-700 border-red-100',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  info: 'bg-blue-50 text-blue-700 border-blue-100',
};

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const Icon = iconMap[type];

  return (
    <div
      className={`p-4 rounded-xl flex items-start gap-3 text-sm border ${styleMap[type]} ${className}`}
      role="alert"
    >
      <Icon size={18} className="shrink-0 mt-0.5" />
      <p className="flex-1">{message}</p>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};
