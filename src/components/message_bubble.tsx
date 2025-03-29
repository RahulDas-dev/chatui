import React from 'react';
import SourceCitation from './source_citation';

interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sources?: Array<{
    title: string;
    url?: string;
    content: string;
  }>;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  content, 
  sender,
  timestamp,
  sources 
}) => {
  return (
    <div className={`max-w-[80%] rounded-xl p-4 ${
      sender === 'user' 
        ? 'bg-blue-600 text-white shadow-md' 
        : 'bg-white border border-gray-200 shadow-sm'
    } transition-all duration-200`}>
      <p>{content}</p>
      {sources && <SourceCitation sources={sources} />}
      <p className="text-xs text-gray-400 mt-2">
        {timestamp.toLocaleTimeString()}
      </p>
    </div>
  );
};

export default MessageBubble;