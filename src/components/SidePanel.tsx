import React, { useState, useEffect } from 'react';
import { FiMenu, FiX, FiMessageSquare, FiSettings } from 'react-icons/fi';

interface SidePanelProps {
  className?: string;
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export const SidePanel = ({
  className = '',
  isExpanded: propIsExpanded,
  onExpandChange,
}: SidePanelProps) => {
  const [isExpanded, setIsExpanded] = useState(propIsExpanded || false);
  // Sync with parent state if provided
  useEffect(() => {
    if (propIsExpanded !== undefined && propIsExpanded !== isExpanded) {
      setIsExpanded(propIsExpanded);
    }
  }, [propIsExpanded, isExpanded]);

  const toggleSidebar = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onExpandChange) {
      onExpandChange(newExpandedState);
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-zinc-900 transition-all duration-300 ease-in-out z-20 ${
        isExpanded ? 'w-64' : 'w-16'
      } ${className}`}
    >
      {!isExpanded ? (
        // Only show Menu button when collapsed
        <div className="p-4 flex justify-center">
          <button
            onClick={toggleSidebar}
            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            aria-label="Expand sidebar"
          >
            <FiMenu size={20} />
          </button>
        </div>
      ) : (
        // Show everything when expanded
        <>
          <div className="p-4 flex justify-end">
            <button
              onClick={toggleSidebar}
              className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              aria-label="Collapse sidebar"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Nav items - only visible when expanded */}
          <nav className="mt-4">
            <ul className="space-y-2">
              <NavItem
                icon={<FiMessageSquare />}
                label="Chats"
                isExpanded={isExpanded}
                isActive={true}
              />
              <NavItem icon={<FiSettings />} label="Settings" isExpanded={isExpanded} />
            </ul>
          </nav>

          {/* User profile section at bottom - only visible when expanded */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center">
              <div className="truncate">
                <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                  User Name
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">user@example.com</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// NavItem sub-component
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isExpanded: boolean;
  isActive?: boolean;
}

const NavItem = ({ icon, label, isExpanded, isActive = false }: NavItemProps) => {
  return (
    <li>
      <a
        href="#"
        className={`flex items-center px-4 py-3 ${
          isActive
            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
            : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
      >
        <div className="flex items-center justify-center w-6 h-6">{icon}</div>
        {isExpanded && <span className="ml-3 font-medium">{label}</span>}
      </a>
    </li>
  );
};
