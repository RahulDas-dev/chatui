// Shared types for the chat application

export interface Message {
    id: string;
    text: string;
    timestamp: Date;
    sender: 'user' | 'bot';
}

export interface ChatSession {
    id: string;
    name?: string; // Optional custom name for the chat
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatState {
    sessions: ChatSession[];
    currentSessionId: string | null;
    isTyping: boolean;
}

// API-related types
export interface ChatRequest {
    message: string;
    sessionId?: string;
    userId?: string;
}

export interface ChatResponse {
    message: string;
    sessionId: string;
    timestamp: string;
    success: boolean;
}

export interface ApiError {
    error: string;
    code?: number;
    message?: string;
}
