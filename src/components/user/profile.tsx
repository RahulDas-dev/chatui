// Temporary implementation - will replace UserProfile.tsx once verified
import * as React from 'react';
import { User, Settings, LogOut } from 'lucide-react';

type UserStatus = 'active' | 'idle' | 'offline';

interface ProfileProps {
  name: string;
  email: string;
  plan: string;
  status?: UserStatus;
  avatarUrl?: string;
}

const statusColors: Record<UserStatus, string> = {
  active: 'bg-green-500',
  idle: 'bg-yellow-500',
  offline: 'bg-gray-500'
};

export const UserProfile: React.FC<ProfileProps> = ({
  name,
  email,
  plan,
  status = 'active',
  avatarUrl
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative p-4 border-b border-gray-200 dark:border-gray-700">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 w-full"
        aria-expanded={isOpen}
        aria-label="User profile menu"
      >
        {avatarUrl ? (
          <div className="relative">
            <img 
              src={avatarUrl}
              alt={name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span 
              className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-white dark:border-gray-800`}
              aria-label={`Status: ${status}`}
            />
          </div>
        ) : (
          <div className="relative w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
            <User size={20} />
            <span 
              className={`absolute bottom-0 right-0 w-3 h-3 ${statusColors[status]} rounded-full border-2 border-white dark:border-gray-800`}
              aria-label={`Status: ${status}`}
            />
          </div>
        )}
        <div className="text-left">
          <p className="font-medium text-gray-900 dark:text-white truncate">{name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{plan}</p>
        </div>
      </button>

      {isOpen && (
        <div 
          className="absolute left-4 right-4 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 border border-gray-200 dark:border-gray-700"
          role="menu"
        >
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <p className="font-medium text-gray-900 dark:text-white">{name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{email}</p>
          </div>
          <div className="p-1">
            <button 
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              role="menuitem"
            >
              <Settings size={16} />
              Settings
            </button>
            <button 
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              role="menuitem"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};