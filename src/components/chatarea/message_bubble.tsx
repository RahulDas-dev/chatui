import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import SourceCitation from './source_citation';

interface MessageBubbleProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
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
        ? 'bg-blue-200 text-black shadow-md' 
        : 'bg-white border border-gray-200 shadow-sm'
    } transition-all duration-200`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props: {
            node?: unknown;
            inline?: boolean;
            className?: string;
            children?: React.ReactNode;
          }) {
            const {node, inline, className, children, ...rest} = props;
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match?.[1] || 'text'}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
      {sources && <SourceCitation sources={sources} />}
      <p className="text-xs text-gray-400 mt-2">
        {timestamp.toLocaleTimeString()}
      </p>
    </div>
  );
};

export default MessageBubble;