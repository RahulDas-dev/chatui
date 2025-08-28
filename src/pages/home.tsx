import { useRef, useEffect, useContext, useState } from 'react';
import { InputArea } from '../components/InputArea';
import { MessageArea } from '../components/MessageArea';
import { SidePanel } from '../components/SidePanel';
import { ChatContext } from '../context/ChatContextValue';

export const HomePage = () => {
  const { state } = useContext(ChatContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages]);
  return (
    <div className="flex h-screen bg-white dark:bg-zinc-900">
      <SidePanel isExpanded={sidebarExpanded} onExpandChange={setSidebarExpanded} />
      {/* Main Content */}
      <div
        className="flex-1 flex flex-col h-full overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }}
      >
        {/* Header */}
        <div className="flex-shrink-0  bg-white dark:bg-zinc-900 z-10">
          <h1 className="text-xl font-semibold text-center py-4">Chat Application</h1>
        </div>
        {/* Chat area - This is the main scrollable container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="container-lg mx-auto">
            <MessageArea typingIndicator="minimal" />
            <div ref={messagesEndRef} className="pb-32" />
          </div>
        </div>{' '}
        {/* Input area - Fixed at the bottom */}
        <div
          className="fixed bottom-0 left-0 right-0 z-20 pb-4 pt-2 bg-white dark:bg-zinc-900 transition-all duration-300"
          style={{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }}
        >
          <div className="container-lg mx-auto">
            <InputArea />
          </div>
        </div>
      </div>
    </div>
  );
};
