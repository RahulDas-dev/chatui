import { useState, useCallback, useMemo } from 'react';

export const usePdfNavigation = () => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);

  // Memoize page navigation state
  const pageNavigationState = useMemo(() => {
    return {
      isFirstPage: pageNumber <= 1,
      isLastPage: pageNumber >= (numPages || 0),
      currentPage: pageNumber,
      totalPages: numPages || 0,
    };
  }, [pageNumber, numPages]);

  // Function to navigate to the next page
  const nextPage = useCallback(() => {
    if (pageNumber < (numPages || 0)) {
      setPageNumber((prev) => prev + 1);
    }
  }, [pageNumber, numPages]);

  // Function to navigate to the previous page
  const previousPage = useCallback(() => {
    if (pageNumber > 1) {
      setPageNumber((prev) => prev - 1);
    }
  }, [pageNumber]);

  return {
    pageNumber,
    numPages,
    setNumPages,
    setPageNumber,
    pageNavigationState,
    nextPage,
    previousPage,
  };
};
