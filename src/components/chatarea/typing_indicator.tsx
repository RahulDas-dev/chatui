import React from 'react';


interface TypingIndicatorProps {
  sender: string;
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ sender, className = '' }) => {

  
  return (
    <div className={`flex items-center space-x-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 w-fit ${className}`}>
      <div className={`w-2 h-2 rounded-full animate-bounce bg-blue-400`} style={{ animationDelay: '0ms' }} />
      <div className={`w-2 h-2 rounded-full animate-bounce bg-blue-400`} style={{ animationDelay: '150ms' }} />
      <div className={`w-2 h-2 rounded-full animate-bounce bg-blue-400`} style={{ animationDelay: '300ms' }} />

      <span className="ml-2 text-sm text-gray-500 dark:text-gray-300">{sender} is typing...</span>
    </div>
  );
};

export default TypingIndicator;
