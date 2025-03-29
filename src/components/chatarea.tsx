
import React, { FC, useState } from 'react';
import useErrorHandling from '../hooks/useErrorHandling';
import ErrorToast from './error_tosts';
import ErrorModal from './error_modal';
import RAGService from '../services/rag_services';
import MessageBubble from './message_bubble';

const ChatArea: FC = () => {
  const { 
    activeError, 
    handleError, 
    dismissError,
    isLoading 
  } = useErrorHandling();

  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    sources?: Array<{
      title: string;
      url?: string;
      content: string;
    }>;
  }>>([]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    try {
      const response = await RAGService.query(inputValue);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content: response.answer,
        sender: 'ai' as const,
        timestamp: new Date(),
        sources: response.sources
      }]);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="bg-gray-50 h-[calc(100vh-4rem)] relative flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {messages.map(message => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <MessageBubble
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
              sources={message.sources}
            />
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
      
      {/* Error displays */}
      {activeError && activeError.severity === 'error' ? (
        <ErrorModal 
          error={activeError} 
          onClose={dismissError} 
        />
      ) : (
        activeError && (
          <ErrorToast 
            error={activeError} 
            onDismiss={dismissError} 
          />
        )
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}

export default ChatArea;