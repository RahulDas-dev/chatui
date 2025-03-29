import React, { useState } from 'react';
import RAGService from '../services/rag_services';
import useErrorHandling from '../hooks/useErrorHandling';
import { Upload, FileText, X, Check, Loader2 } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'success' | 'error';
  file: File;
}

const DocumentUpload: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const { handleError } = useErrorHandling();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    
    const newFiles = Array.from(e.target.files).map(file => {
      // Validate file type
      const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        handleError({
          title: 'Invalid File Type',
          message: 'Please upload a PDF, TXT, or DOCX file',
          severity: 'error'
        });
        return null;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        handleError({
          title: 'File Too Large',
          message: 'Maximum file size is 10MB',
          severity: 'error'
        });
        return null;
      }

      return {
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        status: 'uploading' as const,
        file
      };
    }).filter(Boolean) as UploadedFile[];

    setFiles(prev => [...prev, ...newFiles]);

    // Process uploads
    newFiles.forEach(async (file) => {
      try {
        await RAGService.uploadDocument(file.file);
        setFiles(prev => prev.map(f => 
          f.id === file.id ? {...f, status: 'success'} : f
        ));
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === file.id ? {...f, status: 'error'} : f
        ));
        handleError(error);
      }
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upload Documents</h2>
      
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            PDF, DOCX, TXT (Max. 10MB)
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          multiple
          onChange={handleFileChange}
          accept=".pdf,.txt,.docx"
        />
      </label>

      {files.length > 0 && (
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
                  <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[180px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {file.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.status === 'uploading' && (
                    <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                  )}
                  {file.status === 'success' && (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                  {file.status === 'error' && (
                    <X className="h-4 w-4 text-red-500" />
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;