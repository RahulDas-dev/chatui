import React, { FC } from 'react';

interface ISideBarProps {
  isVisible: boolean;
  toggleSidebar: () => void;
}

const SideBar: FC<ISideBarProps> = ({ isVisible, toggleSidebar }) => {
  return (
    <div className={`bg-fuchsia-100 h-full ${isVisible ? '' : 'hidden'} w-64`}>
      <button onClick={toggleSidebar} className="p-2 bg-blue-500 text-white block">
        {isVisible ? 'Hide Sidebar' : 'Show Sidebar'}
      </button>
      <button className="p-2 bg-green-500 text-white block">
        New Chat
      </button>
      <h1 className="text-lg">SideBar</h1>
    </div>
  );
}

export default SideBar;
