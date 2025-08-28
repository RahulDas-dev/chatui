import React, { memo } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Button } from '../ui/Button';

interface PdfNavigationProps {
  currentPage: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const PdfNavigation: React.FC<PdfNavigationProps> = memo(
  ({ currentPage, totalPages, isFirstPage, isLastPage, onPrevious, onNext }) => {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="secondary"
          size="small"
          onClick={onPrevious}
          disabled={isFirstPage}
          tooltip={isFirstPage ? 'First page' : 'Previous page'}
          className="flex items-center"
        >
          <FiChevronLeft className="mr-1" /> Previous
        </Button>

        <Button
          variant="secondary"
          size="small"
          onClick={onNext}
          disabled={isLastPage}
          tooltip={isLastPage ? 'Last page' : 'Next page'}
          className="flex items-center"
        >
          Next <FiChevronRight className="ml-1" />
        </Button>

        <p className="text-sm font-mono text-zinc-600 dark:text-zinc-400 ml-2 whitespace-nowrap">
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
    );
  }
);
