import { Component, ErrorInfo, ReactNode } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
  onRetry: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PdfErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('PDF rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center p-6 bg-white dark:bg-zinc-700 rounded-lg shadow max-w-md">
            <FiAlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              PDF Rendering Error
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm">
              There was a problem displaying this PDF. This could be due to the file being corrupted
              or an issue with the PDF viewer.
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500 font-mono mb-4 overflow-auto max-h-20 bg-zinc-100 dark:bg-zinc-800 p-2 rounded">
              {this.state.error?.message || 'Unknown error'}
            </p>
            <Button
              variant="primary"
              size="small"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                this.props.onRetry();
              }}
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
