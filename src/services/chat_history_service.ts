import { CHAT_HISTORY_URL } from '../config';

export const fetchChatHistory = async () => {
    const response = await fetch(CHAT_HISTORY_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch chat history');
    }
    return response.json();
};
