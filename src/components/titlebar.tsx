import React, { FC } from 'react';

const TitleBar: FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const handleToggle = () => {
    toggleSidebar();
  };

  return (
    <div className="w-full bg-gray-900 h-16 flex items-center justify-between px-6 shadow-lg">
      <h1 className="text-2xl font-semibold tracking-wide text-white">Chat Application</h1>
      <button 
        onClick={handleToggle}
        className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all duration-200"
      >
        Toggle Sidebar
      </button>
    </div>
  );
}

export default TitleBar;
