import type { AxiosError } from 'axios';

export type ErrorSeverity = 'warning'|'error'|'info';
export interface ErrorType {
  title: string;
  message: string;
  severity: ErrorSeverity;
  retryable?: boolean;
  retryAfter?: number;
};

class ErrorService {
  static getErrorMessage(error: unknown): ErrorType {
    const axiosError = error as AxiosError;
    
    // Handle rate limiting
    if (axiosError.response?.status === 429) {
      return {
        title: "Rate Limited",
        message: "You've exceeded API request limits.",
        severity: "warning",
        retryable: true,
        retryAfter: parseInt(axiosError.response.headers['retry-after'] || '60')
      };
    }

    // Handle context window exhaustion
    if (axiosError.response?.status === 413) {
      return {
        title: "Context Full",
        message: "Conversation too long. Please start a new chat.",
        severity: "info",
        retryable: false
      };
    }

    // Handle network errors
    if (!axiosError.response) {
      return {
        title: "Network Error",
        message: "Unable to connect to the server. Check your connection.",
        severity: "error",
        retryable: true
      };
    }

    // Default case
    return {
      title: "Error",
      message: (axiosError.response.data as any)?.message || "An unexpected error occurred",
      severity: "error",
      retryable: false
    };
  }

  static logError(error: unknown) {
    // TODO: Integrate with error tracking service
    console.error('Application error:', error);
  }
}

export default ErrorService;