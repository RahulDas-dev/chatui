import { memo } from 'react';
import { BiLoaderAlt, BiDotsHorizontalRounded } from 'react-icons/bi';
import { CgSpinner } from 'react-icons/cg';

type TypingIndicatorProps = {
  variant: 'spinner' | 'dots' | 'classic' | 'minimal';
  className?: string;
};

// A component that displays various typing indicator styles
export const TypingIndicator = memo(
  ({ variant = 'spinner', className = '' }: TypingIndicatorProps) => {
    const baseClasses = `flex items-center ${className}`;

    // Render different variants
    switch (variant) {
      case 'spinner':
        return (
          <div className={baseClasses}>
            <BiLoaderAlt className="animate-spin text-zinc-600 dark:text-zinc-400 h-4 w-4 mr-2" />
            <span className="font-mono text-sm">Thinking...</span>
          </div>
        );

      case 'dots':
        return (
          <div className={baseClasses}>
            <BiDotsHorizontalRounded className="animate-pulse text-zinc-600 dark:text-zinc-400 h-5 w-5 mr-1" />
            <span className="font-mono text-sm">Typing</span>
          </div>
        );

      case 'minimal':
        return (
          <div className={baseClasses}>
            <CgSpinner className="animate-spin text-zinc-800 dark:text-zinc-300 h-5 w-5 mr-2" />
            <span className="font-mono text-sm">Loading response...</span>
          </div>
        );
    }
  }
);
