import type { ChatRequest, ChatResponse } from '../types';

class ChatService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = import.meta.env.VITE_APP_CHAT_ENDPOINT || 'http://localhost:5000/chat';
    }

    /**
     * Send a message to the chat API and get a response
     */
    async sendMessage(request: ChatRequest): Promise<ChatResponse> {
        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(
                    errorData.message || 
                    errorData.error || 
                    `HTTP ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Chat API Error:', error);
            
            // Return a fallback response for development/demo purposes
            if (error instanceof Error && error.message.includes('fetch')) {
                console.warn('API not available, using fallback response');
                return this.getFallbackResponse(request.message);
            }
            
            throw error;
        }
    }

    /**
     * Get chat history from the API
     */
    async getChatHistory(sessionId: string): Promise<ChatResponse[]> {
        try {
            const response = await fetch(`${this.baseUrl}/history/${sessionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to fetch chat history:', error);
            return [];
        }
    }

    /**
     * Delete a chat session
     */
    async deleteSession(sessionId: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/session/${sessionId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.ok;
        } catch (error) {
            console.error('Failed to delete session:', error);
            return false;
        }
    }

    /**
     * Fallback response for when API is not available (development/demo)
     */
    private getFallbackResponse(message: string): ChatResponse {
        const responses = [
            `I received your message: "${message}"`,
            "That's interesting! Tell me more.",
            "I understand what you're saying.",
            'Thanks for sharing that with me.',
            'How can I help you with that?',
            'That sounds great!',
            'I see what you mean.',
            'Could you elaborate on that?',
            'That\'s a good point.',
            'I\'m here to help with any questions you have.',
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        return {
            message: randomResponse,
            sessionId: uuidv4(),
            timestamp: new Date().toISOString(),
            success: true,
        };
    }

    /**
     * Check if the chat service is available
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.ok;
        } catch {
            return false;
        }
    }
}

// Export a singleton instance
export const chatService = new ChatService();

// Generate UUID for compatibility (since we're using it in the fallback)
function uuidv4(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
