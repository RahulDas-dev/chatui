import { memo } from 'react';
import { FaFilePdf } from 'react-icons/fa';
import { IoCloseCircleOutline } from 'react-icons/io5';

interface FileUploadDisplayProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

export const FileUploadDisplay = memo(({ files, onRemoveFile }: FileUploadDisplayProps) => {
  if (files.length === 0) return null;

  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {files.map((file, index) => (
        <div
          key={index}
          className="flex items-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded px-3 py-2"
        >
          <div className="flex items-center">
            <div className="text-red-500 mr-2">
              <FaFilePdf className="h-5 w-5" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-zinc-900 dark:text-zinc-100">{file.name}</div>
              <div className="text-zinc-500 dark:text-zinc-400 text-xs">PDF</div>
            </div>
          </div>
          <button
            className="ml-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            onClick={() => onRemoveFile(index)}
          >
            <IoCloseCircleOutline className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
});
