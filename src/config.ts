export const RAG_API_URL = import.meta.env.VITE_RAG_API_URL || 'http://localhost:3000/api/rag';
export const CHAT_HISTORY_URL = import.meta.env.VITE_CHAT_HISTORY_URL || 'http://localhost:3000/api/chat-history';


export const config = {
    apiUrl: import.meta.env.VITE_API_URL,
    chatHistoryUrl: import.meta.env.VITE_CHAT_HISTORY_URL,
};