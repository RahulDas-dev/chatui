import React from 'react';
import { FiLock } from 'react-icons/fi';
import { Button } from '../ui/Button';

interface PdfErrorMessageProps {
  errorMessage: string;
  isPasswordError?: boolean;
  onPasswordRequest?: () => void;
}

export const PdfErrorMessage: React.FC<PdfErrorMessageProps> = ({
  errorMessage,
  isPasswordError,
  onPasswordRequest,
}) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-6 bg-white dark:bg-zinc-700 rounded-lg shadow">
        <p className="text-red-600 dark:text-red-400 font-medium font-montserrat mb-2">
          Error Loading PDF
        </p>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-mono">{errorMessage}</p>
        {isPasswordError && onPasswordRequest && (
          <Button variant="primary" size="small" onClick={onPasswordRequest} className="mt-4">
            <FiLock className="mr-2" /> Enter Password
          </Button>
        )}
      </div>
    </div>
  );
};
