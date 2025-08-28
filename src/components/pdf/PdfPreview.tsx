import React, { useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { Document, Page } from 'react-pdf';
import { FiLoader, FiLock } from 'react-icons/fi';
import { PDF_OPTIONS } from '../../utility/PdfWorker';
import { usePdfPassword } from '../../hooks/pdf/usePdfPassword';
import { usePdfNavigation } from '../../hooks/pdf/usePdfNavigation';
import { usePdfZoom } from '../../hooks/pdf/usePdfZoom';
import { usePdfFile } from '../../hooks/pdf/usePdfFile';
import { PdfToolbar } from './PdfToolBar';
import { PdfNavigation } from './PdfNavigation';
import { PdfZoomControls } from './PdfZoomControls';
import { PdfErrorMessage } from './PdfErrorMessage';
import { PdfPasswordMessage } from './PdfPasswordMessage';
import { Button } from '../ui/Button';
import { PdfErrorBoundary } from './PdfErrorBoundary';

// Lazy load the PasswordDialog to defer loading until needed
const LazyPasswordDialog = lazy(() =>
  import('../ui/PasswordDialog').then((module) => ({ default: module.PasswordDialog }))
);

interface PDFPreviewProps {
  file: File | null;
  onClose: () => void;
  isPasswordProtected?: boolean;
  savedPassword?: string;
  onPasswordSaved?: (password: string) => void;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({
  file,
  onClose,
  isPasswordProtected,
  savedPassword,
  onPasswordSaved,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState<boolean>(false);

  // Custom hooks
  const { fileUrl, error, setError, blobKey, resetBlobUrl } = usePdfFile(file);
  const { scale, zoomIn, zoomOut, resetZoom } = usePdfZoom(1.2);
  const { pageNumber, setNumPages, pageNavigationState, nextPage, previousPage } =
    usePdfNavigation();

  const {
    password,
    passwordAttempts,
    isPasswordValidated,
    showPasswordDialog,
    passwordError,
    setShowPasswordDialog,
    setPasswordError,
    handlePasswordSubmit,
    handlePasswordCancel,
    onDocumentLoadSuccess: passwordLoadSuccess,
  } = usePdfPassword({
    isPasswordProtected,
    savedPassword,
    onPasswordSaved,
  });

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    return () => {
      // Force garbage collection of PDF resources when component unmounts
      if (window.gc) {
        try {
          window.gc();
        } catch (e) {
          console.warn('Manual garbage collection failed', e);
        }
      }
    };
  }, []);
  // Function to toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    const container = document.getElementById('pdf-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  const resetBlobKey = useCallback(() => {
    resetBlobUrl();
  }, [resetBlobUrl]);

  const downloadPDF = useCallback(() => {
    if (!file || !fileUrl) return;

    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [file, fileUrl]);

  // Prepare PDF options with password if provided
  const pdfOptions = useMemo(() => {
    return password
      ? {
          ...PDF_OPTIONS,
          password,
          isEvalSupported: false,
          disableAutoFetch: true,
          disableStream: true,
          ownerPassword: password,
          userPassword: password,
          cMapPacked: true,
          cacheSize: 10, // Cache up to 10 pages
        }
      : {
          ...PDF_OPTIONS,
          isEvalSupported: false,
          disableAutoFetch: true,
          disableStream: true,
          cMapPacked: true,
          cacheSize: 10, // Cache up to 10 pages
        };
  }, [password]);

  // Create file object with a key that changes when password changes
  const documentFile = useMemo(() => {
    if (!fileUrl) return null;

    return {
      url: fileUrl,
      passwordAttempt: passwordAttempts,
      password,
      key: blobKey, // Add this to ensure the Document re-renders with a new URL
    };
  }, [fileUrl, passwordAttempts, password, blobKey]);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
      passwordLoadSuccess();
      setError(null);
    },
    [passwordLoadSuccess, setNumPages, setError]
  );

  const onDocumentLoadError = useCallback(
    (err: Error) => {
      console.error('Error loading PDF:', err);

      if (
        (err.name === 'PasswordException' || String(err).includes('password')) &&
        !isPasswordValidated
      ) {
        setShowPasswordDialog(true);

        if (passwordAttempts > 0) {
          setPasswordError('Incorrect password. Please try again.');
        } else {
          setPasswordError(null);
        }
      } else {
        setError(err.message);
      }
    },
    [passwordAttempts, isPasswordValidated, setShowPasswordDialog, setPasswordError, setError]
  );

  useEffect(() => {
    const preventDefaultDialogs = (event: BeforeUnloadEvent) => {
      if (event.preventDefault) {
        event.preventDefault();
      }
      return false;
    };
    window.addEventListener('beforeunload', preventDefaultDialogs);
    const promptFn = () => {
      if (isPasswordValidated || showPasswordDialog || passwordError) {
        return null;
      }
      setShowPasswordDialog(true);
      return null;
    };
    const originalPrompt = window.prompt;
    window.prompt = promptFn;
    return () => {
      window.removeEventListener('beforeunload', preventDefaultDialogs);
      window.prompt = originalPrompt;
    };
  }, [showPasswordDialog, passwordError, isPasswordValidated, setShowPasswordDialog]);

  const LoadingIndicator = useMemo(
    () => (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-center">
          <div className="h-16 w-16 mx-auto rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <FiLoader className="animate-spin h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="mt-4 text-zinc-700 dark:text-zinc-300 font-montserrat">Loading PDF...</p>
        </div>
      </div>
    ),
    []
  );

  const ErrorDisplay = useMemo(
    () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-6 bg-white dark:bg-zinc-700 rounded-lg shadow">
          <p className="text-red-600 dark:text-red-400 font-medium font-montserrat mb-2">
            Error Loading PDF
          </p>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm font-mono">
            There was a problem loading the PDF. Please try again.
          </p>
          {passwordAttempts > 0 && (
            <Button
              variant="primary"
              size="small"
              className="mt-4"
              onClick={() => {
                setPasswordError('Incorrect password. Please try again.');
                setShowPasswordDialog(true);
              }}
            >
              <FiLock className="mr-2" /> Try Another Password
            </Button>
          )}
        </div>
      </div>
    ),
    [passwordAttempts, setPasswordError, setShowPasswordDialog]
  );

  if (!file || !fileUrl) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {showPasswordDialog && (
        <Suspense fallback={null}>
          <LazyPasswordDialog
            onSubmit={handlePasswordSubmit}
            onCancel={handlePasswordCancel}
            error={passwordError}
          />
        </Suspense>
      )}

      {/* Only render Document component if we either have a password or the file is not password protected */}
      {(!isPasswordProtected || password) && (
        <div
          id="pdf-container"
          className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <PdfToolbar
            fileName={file.name}
            isPasswordProtected={isPasswordProtected}
            isFullscreen={isFullscreen}
            onDownload={downloadPDF}
            onToggleFullscreen={toggleFullscreen}
            onClose={onClose}
          />

          <div className="flex-1 p-4 flex justify-center bg-zinc-100 dark:bg-zinc-800 overflow-auto">
            {error ? (
              <PdfErrorMessage
                errorMessage={error}
                isPasswordError={error.includes('Password')}
                onPasswordRequest={() => setShowPasswordDialog(true)}
              />
            ) : (
              <PdfErrorBoundary onRetry={resetBlobKey}>
                <Document
                  key={blobKey}
                  file={documentFile}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  className="flex justify-center"
                  options={pdfOptions}
                  externalLinkTarget="_blank"
                  loading={LoadingIndicator}
                  error={ErrorDisplay}
                >
                  <Page
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    className="shadow-xl"
                    scale={scale}
                    loading={
                      <div className="h-[800px] w-[600px] bg-zinc-100 dark:bg-zinc-700 animate-pulse rounded shadow-md"></div>
                    }
                    error={
                      <div className="h-[800px] w-[600px] flex items-center justify-center bg-zinc-100 dark:bg-zinc-700 rounded shadow-md">
                        <p className="text-red-500 font-montserrat">
                          Error rendering page {pageNumber}
                        </p>
                      </div>
                    }
                  />
                </Document>
              </PdfErrorBoundary>
            )}
          </div>

          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
            <PdfNavigation
              currentPage={pageNavigationState.currentPage}
              totalPages={pageNavigationState.totalPages}
              isFirstPage={pageNavigationState.isFirstPage}
              isLastPage={pageNavigationState.isLastPage}
              onPrevious={previousPage}
              onNext={nextPage}
            />

            <PdfZoomControls
              scale={scale}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onReset={resetZoom}
            />
          </div>
        </div>
      )}

      {/* Show a clearer message when password was canceled */}
      {isPasswordProtected && !password && error && !showPasswordDialog && (
        <PdfPasswordMessage
          error={error}
          onClose={onClose}
          onEnterPassword={() => setShowPasswordDialog(true)}
        />
      )}
    </div>
  );
};
