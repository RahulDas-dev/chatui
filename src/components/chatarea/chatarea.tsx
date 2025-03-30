import  { FC, useState, useRef } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import TypingIndicator from './typing_indicator';
import useErrorHandling from '../../hooks/useErrorHandling';
import ErrorToast from '../error_tosts';
import ErrorModal from '../error_modal';
import RAGService from '../../services/rag_services';
import MessageBubble from './message_bubble';

const ChatArea: FC = () => {
  const { 
    activeError, 
    handleError, 
    dismissError,
    isLoading 
  } = useErrorHandling();

  type MessageStatus = 'sent' | 'delivered' | 'read';
  
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    status: MessageStatus;
    sources?: Array<{
      title: string;
      url?: string;
      content: string;
    }>;
  }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef<number | null>(null);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user' as const,
      timestamp: new Date(),
      status: 'sent' as const,
      sources: undefined
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
        status: 'delivered' as const,
        sources: response.sources
      }]);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className={`h-[calc(100vh-4rem)] relative flex flex-col bg-gray-50 dark:bg-gray-900`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
        {isTyping && (
          <div className="flex justify-start">
            <TypingIndicator sender="AI Assistant" className="ml-2" />
          </div>
        )}
        {messages.map(message => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <MessageBubble
              content={message.content}
              sender={message.sender}
              timestamp={message.timestamp}
              status={message.status}
              sources={message.sources}
            />
          </div>
        ))}
      </div>
      
      <div className={`p-4 bg-white  dark:bg-gray-900 `}>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setIsTyping(true);
              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
              }
              typingTimeoutRef.current = window.setTimeout(() => setIsTyping(false), 2000);
            }}
            className={`flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white border-gray-300 text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400`}
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className={`bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg disabled:opacity-50 transition-all duration-200 hover:scale-105 shadow-md dark:bg-blue-600 dark:hover:bg-blue-700`}
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="h-6 w-6" aria-hidden="true" />
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
