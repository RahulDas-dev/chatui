import { useState, useCallback } from 'react';
import ErrorService from '../services/error_services';
import type { ErrorType } from '../services/error_services';

const useErrorHandling = () => {
  const [activeError, setActiveError] = useState<ErrorType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error: unknown) => {
    const formattedError = ErrorService.getErrorMessage(error);
    ErrorService.logError(error);
    setActiveError(formattedError);
    
    // Auto-dismiss non-critical errors after 8 seconds
    if (formattedError.severity !== 'error') {
      setTimeout(() => setActiveError(null), 8000);
    }
  }, []);

  const dismissError = useCallback(() => {
    setActiveError(null);
  }, []);

  const retryOperation = useCallback(async (
    operation: () => Promise<void>, 
    maxRetries = 3
  ) => {
    setIsLoading(true);
    try {
      await operation();
      setActiveError(null);
    } catch (error) {
      if (maxRetries > 0) {
        setTimeout(() => retryOperation(operation, maxRetries - 1), 1000);
      } else {
        handleError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleError]);

  return {
    activeError,
    isLoading,
    handleError,
    dismissError,
    retryOperation
  };
};

export default useErrorHandling;