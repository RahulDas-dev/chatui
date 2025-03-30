import React, { useState, useEffect } from 'react';
import { fetchChatHistory } from '../../services/chat_history_service';

import { Search, History } from 'lucide-react';
import CollapsibleSection from '../common/collapsible_section';

interface Chat {
  id: string;
  title: string;
}

const ChatHistory: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await fetchChatHistory();
        setChatHistory(history);
      } catch (error) {
        console.error(error); // Log the error for debugging
        setError('Failed to load chat history'); // Set error state
      } finally {
        setLoading(false);
      }
    };

    loadChatHistory();
  }, []);

  const [selectedChat, setSelectedChat] = useState<string>('');

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search chats..."
          value={selectedChat} // Bind search term
          onChange={(e) => setSelectedChat(e.target.value)} // Update search term
          className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
      {loading && <p className="text-blue-500">Loading chat history...</p>}

      {error && <p className="text-red-500">{error}</p>}

      { !loading && !error && (
      <CollapsibleSection
        title="Recent Chats"
        icon={<History size={14} />}
        defaultOpen={true}
      >
        {
          chatHistory.filter(chat => chat.title.toLowerCase().includes(selectedChat.toLowerCase())).map(chat => (
            <button
              key={chat.id}
              className="w-full text-left py-2 px-3 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-300 transition-colors"
            >
              {chat.title}
            </button>
          ))
        }
      </CollapsibleSection>
      )}
    </div>
  );
};

export default ChatHistory;
