import React, { useState } from 'react';
import RAGService from '../services/rag_services';
import useErrorHandling from '../hooks/useErrorHandling';
import { DocumentArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const DocumentUpload: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { handleError } = useErrorHandling();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      handleError({
        title: 'Invalid File Type',
        message: 'Please upload a PDF, TXT, or DOCX file',
        severity: 'error'
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      handleError({
        title: 'File Too Large',
        message: 'Maximum file size is 5MB',
        severity: 'error'
      });
      return;
    }

    try {
      setIsUploading(true);
      setUploadSuccess(false);
      await RAGService.uploadDocument(file);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      handleError(error);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="p-4 border-t border-gray-200">
      <label className={`flex items-center justify-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all ${
        uploadSuccess 
          ? 'bg-green-50 border-green-400 text-green-700 shadow-sm'
          : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
      } ${isUploading ? 'opacity-75' : ''}`}>
        {uploadSuccess ? (
          <CheckCircleIcon className="h-6 w-6 text-green-500" />
        ) : (
          <DocumentArrowUpIcon className="h-6 w-6 text-gray-500" />
        )}
        <span className="text-sm font-medium">
          {uploadSuccess ? 'Upload Successful!' : 
           isUploading ? 'Uploading...' : 'Upload Document'}
        </span>
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.txt,.docx"
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default DocumentUpload;