import React from 'react';
import { FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { Button } from '../ui/Button';

interface PdfZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export const PdfZoomControls: React.FC<PdfZoomControlsProps> = ({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="icon"
        size="small"
        onClick={onZoomOut}
        disabled={scale <= 0.6}
        tooltip="Zoom out"
        className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        <FiZoomOut className="h-5 w-5" />
      </Button>

      <span className="text-sm font-mono text-zinc-600 dark:text-zinc-400 min-w-[60px] text-center">
        {Math.round(scale * 100)}%
      </span>

      <Button
        variant="icon"
        size="small"
        onClick={onZoomIn}
        disabled={scale >= 3.0}
        tooltip="Zoom in"
        className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        <FiZoomIn className="h-5 w-5" />
      </Button>

      <Button
        variant="icon"
        size="small"
        onClick={onReset}
        className="text-sm font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
        tooltip="Reset zoom"
      >
        Reset
      </Button>
    </div>
  );
};
