import React from 'react';
import { FiLock } from 'react-icons/fi';
import { Button } from '../ui/Button';

interface PdfPasswordMessageProps {
  error: string;
  onClose: () => void;
  onEnterPassword: () => void;
}

export const PdfPasswordMessage: React.FC<PdfPasswordMessageProps> = ({
  error,
  onClose,
  onEnterPassword,
}) => {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-md w-full p-6 text-center">
      <div className="mb-4 flex justify-center">
        <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full">
          <FiLock className="h-8 w-8 text-red-500 dark:text-red-400" />
        </div>
      </div>
      <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
        Password Required
      </h3>
      <p className="text-zinc-600 dark:text-zinc-400 mb-6">{error}</p>
      <div className="flex justify-center space-x-3">
        <Button variant="secondary" size="small" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" size="small" onClick={onEnterPassword}>
          Enter Password
        </Button>
      </div>
    </div>
  );
};
