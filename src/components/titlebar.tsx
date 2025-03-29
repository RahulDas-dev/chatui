import React, { FC } from 'react';
import { useTheme } from '../hooks/useTheme';
import { SunIcon, MoonIcon, Bars3CenterLeftIcon } from '@heroicons/react/24/outline';

const TitleBar: FC<{ toggleSidebar: () => void }> = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const handleToggle = () => {
    toggleSidebar();
  };

  return (
    <div className={`w-full h-16 flex items-center justify-between px-6 shadow-lg ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-amber-50' // Off-white color
    }`}>
      <h1 className={`text-2xl font-semibold tracking-wide ${
        theme === 'dark' ? 'text-white' : 'text-gray-800'
      }`}>Chat Application</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <SunIcon className="h-6 w-6 text-yellow-300" />
          ) : (
            <MoonIcon className="h-6 w-6 text-gray-300" />
          )}
        </button>
        <button
          onClick={handleToggle}
          className={`p-2 rounded-lg transition-all duration-200 ${
            theme === 'dark'
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-amber-100 hover:bg-amber-200 text-gray-800'
          }`}
          aria-label="Toggle sidebar"
        >
          <Bars3CenterLeftIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}

export default TitleBar;
