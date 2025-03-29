import axios from 'axios';
import { RAG_API_URL } from '../config';
import ErrorService from './error_services';

class RAGService {
  private baseUrl: string = RAG_API_URL;

  async query(prompt: string, context?: string): Promise<{
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
      });
      
      return response.data;
    } catch (error) {
      ErrorService.logError(error);
      throw error;
    }
  }

  async uploadDocument(file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      await axios.post(`${this.baseUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } catch (error) {
      ErrorService.logError(error);
      throw error;
    }
  }
}

export default new RAGService();