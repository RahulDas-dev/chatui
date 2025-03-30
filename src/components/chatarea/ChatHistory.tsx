import React, { useState } from 'react';
import { Search} from 'lucide-react';
interface Chat {
  id: string;
  title: string;
}



const ChatHistory: React.FC = () => {

  const [chatHistory] = useState<Chat[]>([
      { id: '1', title: 'RAG Implementation' },
      { id: '2', title: 'LLM Fine-tuning' },
      { id: '3', title: 'UI Components' }
    ]);

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
      <div className="space-y-4">
        {chatHistory.filter(chat => chat.title.toLowerCase().includes(selectedChat.toLowerCase())).map(chat => (
          <button
            key={chat.id}
            className="w-full text-left py-2 px-3 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-800 dark:text-gray-300 transition-colors"
          >
            {chat.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
