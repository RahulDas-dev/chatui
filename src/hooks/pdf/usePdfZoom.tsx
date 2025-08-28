import { debounce } from 'lodash';

import { useState, useCallback, useMemo } from 'react';

export const usePdfZoom = (initialScale = 1.2) => {
  const [scale, setScale] = useState<number>(initialScale);

  const debouncedSetScale = useMemo(
    () =>
      debounce((newScale: number) => {
        setScale(newScale);
      }, 150),
    [setScale]
  );

  const zoomIn = useCallback(() => {
    const newScale = Math.min(scale + 0.2, 3.0);
    debouncedSetScale(newScale);
  }, [scale, debouncedSetScale]);

  const zoomOut = useCallback(() => {
    const newScale = Math.max(scale - 0.2, 0.6);
    debouncedSetScale(newScale);
  }, [scale, debouncedSetScale]);

  const resetZoom = useCallback(() => {
    debouncedSetScale(initialScale);
  }, [initialScale, debouncedSetScale]);

  return {
    scale,
    zoomIn,
    zoomOut,
    resetZoom,
  };
};
