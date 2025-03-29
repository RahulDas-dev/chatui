import React, { FC } from 'react';
import DocumentUpload from './doc_upload';

interface ISideBarProps {
  isVisible: boolean;
  toggleSidebar: () => void;
}

const SideBar: FC<ISideBarProps> = ({ isVisible, toggleSidebar }) => {
  return (
    <div className={`bg-neutral-200 h-full ${isVisible ? '' : 'hidden'} w-64 flex flex-col transition-all duration-300 shadow-xl`}>
      <div className="flex-1 p-4 space-y-4">
        <button 
          onClick={toggleSidebar} 
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <span>{isVisible ? 'Hide' : 'Show'}</span>
        </button>
        <button className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md transition-all duration-200">
          New Chat
        </button>
        <h1 className="text-xl font-semibold text-black pb-2 border-b border-white/20">Chat History</h1>
      </div>
      <DocumentUpload />
    </div>
  );
}

export default SideBar;
