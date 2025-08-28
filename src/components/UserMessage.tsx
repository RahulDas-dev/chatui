import { memo } from 'react';
import { useTheme } from '../hooks/useTheme';

interface UserMessageProps {
  text: string;
  timestamp: Date;
}

export const UserMessage = memo(({ text, timestamp }: UserMessageProps) => {
  const { isDark } = useTheme();
  const userMessageBg = isDark ? 'bg-zinc-500' : 'bg-zinc-300';
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex justify-end">
      <div className={`max-w-[80%] rounded-lg px-4 py-1 ${userMessageBg} text-black`}>
        <p className="text-sm font-mono">{text}</p>
        <p className="text-right mt-1 text-xs opacity-70 font-mono">{formatTime(timestamp)}</p>
      </div>
    </div>
  );
});
