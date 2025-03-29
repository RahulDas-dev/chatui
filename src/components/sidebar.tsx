import React, { FC, useState } from 'react';
import DocumentUpload from './doc_upload';
import { ChevronLeft, ChevronRight, Plus, Search, History, FileText, User } from 'lucide-react';

interface ISideBarProps {
  isVisible: boolean;
  toggleSidebar: () => void;
}

const SideBar: FC<ISideBarProps> = ({ isVisible, toggleSidebar }) => {
  const [activeSection, setActiveSection] = useState<'chats' | 'docs'>('chats');
  const [chatHistory] = useState([
    { id: '1', title: 'RAG Implementation' },
    { id: '2', title: 'LLM Fine-tuning' },
    { id: '3', title: 'UI Components' }
  ]);

  return (
    <div className={`bg-gray-50 dark:bg-gray-800 h-full ${isVisible ? '' : 'hidden'} w-72 flex flex-col transition-all duration-300 shadow-xl border-r border-gray-200 dark:border-gray-700`}>
      {/* Profile Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <User size={20} />
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-white">User Name</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Free Plan</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveSection('chats')}
          className={`flex-1 py-3 px-4 text-sm font-medium ${activeSection === 'chats' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <History size={16} />
            Chats
          </div>
        </button>
        <button
          onClick={() => setActiveSection('docs')}
          className={`flex-1 py-3 px-4 text-sm font-medium ${activeSection === 'docs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
        >
          <div className="flex items-center justify-center gap-2">
            <FileText size={16} />
            Documents
          </div>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeSection === 'chats' ? (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>

            <button 
              onClick={toggleSidebar}
              className="w-full flex items-center justify-between py-2 px-3 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50 transition-colors"
            >
              <span>Collapse Sidebar</span>
              <ChevronLeft size={16} />
            </button>

            <button className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors">
              <Plus size={16} />
              New Chat
            </button>

            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">Recent Chats</h3>
              {chatHistory.map(chat => (
                <button
                  key={chat.id}
                  className="w-full text-left py-2 px-3 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  {chat.title}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <DocumentUpload />
        )}
      </div>
    </div>
  );
}

export default SideBar;
