import React from 'react';
import { FiDownload, FiMaximize2, FiMinimize2, FiX, FiLock } from 'react-icons/fi';
import { Button } from '../ui/Button';

interface PdfToolbarProps {
  fileName: string;
  isPasswordProtected?: boolean;
  isFullscreen: boolean;
  onDownload: () => void;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

export const PdfToolbar: React.FC<PdfToolbarProps> = ({
  fileName,
  isPasswordProtected,
  isFullscreen,
  onDownload,
  onToggleFullscreen,
  onClose,
}) => {
  return (
    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
      <h3 className="font-montserrat text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate pr-4 flex items-center">
        {isPasswordProtected && <FiLock className="h-4 w-4 mr-2 text-black dark:text-white" />}
        {fileName}
      </h3>

      <div className="flex items-center space-x-2">
        <Button
          variant="icon"
          size="small"
          onClick={onDownload}
          tooltip="Download PDF"
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          <FiDownload className="h-5 w-5" />
        </Button>

        <Button
          variant="icon"
          size="small"
          onClick={onToggleFullscreen}
          tooltip={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          {isFullscreen ? <FiMinimize2 className="h-5 w-5" /> : <FiMaximize2 className="h-5 w-5" />}
        </Button>

        <Button
          variant="icon"
          size="small"
          onClick={onClose}
          tooltip="Close preview"
          className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          <FiX className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
