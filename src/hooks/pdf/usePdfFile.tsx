import { useState, useEffect, useCallback } from 'react';

export const usePdfFile = (file: File | null) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [blobKey, setBlobKey] = useState<number>(0);

  // Add this function to reset blob URL with a new one
  const resetBlobUrl = useCallback(() => {
    if (file) {
      try {
        // Revoke the previous URL if it exists
        if (fileUrl) {
          URL.revokeObjectURL(fileUrl);
        }

        // Create a new blob URL
        const newUrl = URL.createObjectURL(file);
        setFileUrl(newUrl);

        // Increment the blob key to force remounting
        setBlobKey((prevKey) => prevKey + 1);

        return newUrl;
      } catch (err) {
        console.error('Error creating blob URL:', err);
        setError(err instanceof Error ? err.message : String(err));
        return null;
      }
    }
    return null;
  }, [file, fileUrl]);

  // Create URL for the file when component mounts or when file changes
  useEffect(() => {
    if (file) {
      resetBlobUrl();
    }

    // Clean up function to revoke URLs when unmounting
    return () => {
      if (fileUrl) {
        // Use a small timeout to ensure any ongoing operations complete
        setTimeout(() => {
          try {
            URL.revokeObjectURL(fileUrl);
          } catch (e) {
            console.error('Error revoking URL:', e);
          }
        }, 100);
      }
    };
  }, [file]);

  return {
    fileUrl,
    setFileUrl,
    error,
    setError,
    blobKey,
    resetBlobUrl, // Expose the reset function
  };
};
