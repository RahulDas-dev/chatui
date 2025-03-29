import React, { FC } from 'react';

const TitleBar: FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const handleToggle = () => {
    toggleSidebar();
  };

  return (
    <div className="w-full bg-neutral-100 h-16">
      <h1 className="text-3xl font-bold underline text-amber-900">TitleBar</h1>
      <button onClick={handleToggle} className="p-2 bg-blue-500 text-white">
        Toggle Sidebar
      </button>
    </div>
  );
}

export default TitleBar;
