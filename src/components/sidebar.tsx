import { FC, useState } from 'react';

import DocumentUpload from './doc_upload';
import { UserProfile } from './user/profile';
import { ChevronLeft, Plus, History, FileText } from 'lucide-react';
import ChatHistory from './chatarea/ChatHistory';

interface ISideBarProps {
  isVisible: boolean;
  toggleSidebar: () => void;
}

const SideBar: FC<ISideBarProps> = ({ isVisible, toggleSidebar }) => {
  const [activeSection, setActiveSection] = useState<'chats' | 'docs'>('chats');


  return (
    <div className={`bg-gray-50 dark:bg-gray-900 h-full ${isVisible ? '' : 'hidden'} w-72 flex flex-col transition-all duration-300 shadow-xl border-r border-gray-200 dark:border-gray-700`}>
      {/* Enhanced Profile Section */}
      <UserProfile 
        name="User Name"
        email="user@example.com" 
        plan="Pro Plan"
        status="active"
      />

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

            
            
            <ChatHistory /> // Pass search term



          </div>
        ) : (
          <DocumentUpload />
        )}
      </div>
    </div>
  );
}

export default SideBar;
