import axios, { AxiosProgressEvent } from 'axios';
import { RAG_API_URL } from '../config';
import ErrorService from './error_services';

class RAGService {
  private baseUrl: string = RAG_API_URL;

  async query(prompt: string, context?: string, progressCallback?: (percentage: number) => void): Promise<{
    answer: string;
    sources?: Array<{
      title: string;
      url?: string;
      content: string;
    }>;
  }> {
    try {
      const response = await axios.post(`${this.baseUrl}/query`, {
        prompt,
        context
      }, {
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressCallback) {
            const percentage = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            progressCallback(percentage); // Call progress callback
          }
        }
      });
      
      return response.data;
    } catch (error) {
      ErrorService.logError(error);
      throw error;
    }
  }

  async uploadDocument(file: File, progressCallback?: (percentage: number) => void, signal?: AbortSignal): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await axios.post(`${this.baseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (signal && signal.aborted) {
            throw new Error('Upload aborted');
          }

          if (progressCallback) {
            const percentage = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            progressCallback(percentage); // Call progress callback
          }
        },
        signal // Pass the signal to the request
      });
    } catch (error) {
      ErrorService.logError(error);
      throw error;
    }
  }
}

export default new RAGService();
