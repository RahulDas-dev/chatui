import React from 'react';
import type { ErrorType } from '../services/error_services';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ErrorToastProps {
  error: ErrorType;
  onDismiss: () => void;
}

const ErrorToast: React.FC<ErrorToastProps> = ({ error, onDismiss }) => {
    const bgColor = {
      warning: 'bg-amber-100 dark:bg-amber-600',
      error: 'bg-red-100 dark:bg-red-600',
      info: 'bg-blue-100 dark:bg-blue-600'

  }[error.severity];

    const borderColor = {
      warning: 'border-amber-500 dark:border-amber-400',
      error: 'border-red-500 dark:border-red-400',
      info: 'border-blue-500 dark:border-blue-400'

  }[error.severity];

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${bgColor} border-l-4 ${borderColor} min-w-[300px] max-w-[90vw] z-50`}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-bold text-gray-900">{error.title}</h3>
          <p className="text-sm text-gray-700 mt-1">{error.message}</p>
          {error.retryAfter && (
            <p className="text-xs text-gray-500 mt-2">
              Retry available in {error.retryAfter} seconds
            </p>
          )}
        </div>
        <button 
          onClick={onDismiss}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Dismiss error"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
      {error.retryable && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorToast;
