import React from 'react';
import type { ErrorType } from '../services/error_services';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../hooks/useTheme';

interface ErrorModalProps {
  error: ErrorType;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ error, onClose }) => {
  const { theme } = useTheme();
  
  const iconColor = {
    warning: 'text-amber-500',
    error: 'text-red-500',
    info: 'text-blue-500'
  }[error.severity];

  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const secondaryTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-500';
  const footerBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`${bgColor} rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300`}>
        <div className="p-6">
          <div className="flex items-start">
            <div className={`flex-shrink-0 ${iconColor}`}>
              <ExclamationTriangleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className={`text-lg font-medium ${textColor}`}>
                {error.title}
              </h3>
              <div className={`mt-2 text-sm ${secondaryTextColor}`}>
                <p>{error.message}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={`${footerBg} px-6 py-4 rounded-b-lg flex justify-end`}>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;