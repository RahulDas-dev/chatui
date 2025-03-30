import React from 'react';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'success' | 'error';
  file: File;
}

interface DocumentReviewProps {
  files: UploadedFile[];
  onRemove: (id: string) => void;
}

const DocumentReview: React.FC<DocumentReviewProps> = ({ files, onRemove }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploaded Files</h3>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {files.map(file => (
          <div 
            key={file.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              file.status === 'success' 
                ? 'border-green-200 bg-green-50 dark:border-green-900/30 dark:bg-green-900/10'
                : file.status === 'error'
                ? 'border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-900/10'
                : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/30'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                {file.name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {file.size}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <a href={URL.createObjectURL(file.file)} download className="text-blue-500 hover:underline">View</a>
              <button
                onClick={() => onRemove(file.id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentReview;
