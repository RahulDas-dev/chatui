import { memo, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import {
  FaRegCopy,
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaThumbsUp,
  FaThumbsDown,
} from 'react-icons/fa';

interface BotMessageProps {
  text: string;
  timestamp: Date;
}

export const BotMessage = memo(({ text, timestamp }: BotMessageProps) => {
  const { isDark } = useTheme();
  const botMessageBg = isDark ? 'bg-zinc-700' : 'bg-white';
  const [liked, setLiked] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  // Format the timestamp for display
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setLiked(true);
    // Here you could add logic to send feedback to your backend
  };

  const handleDislike = () => {
    setLiked(false);
    // Here you could add logic to send feedback to your backend
  };

  return (
    <div className="flex justify-start">
      <div
        className={`max-w-[80%] rounded-lg p-3 ${botMessageBg} text-zinc-800 dark:text-zinc-100`}
      >
        <p className="text-sm font-mono">{text}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors"
              title={copied ? 'Copied!' : 'Copy message'}
            >
              <FaRegCopy className="h-4 w-4" />
            </button>
            <button
              onClick={handleLike}
              className={`${liked === true ? 'text-green-500' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'} transition-colors`}
              title="Like this response"
            >
              {liked === true ? (
                <FaThumbsUp className="h-4 w-4" />
              ) : (
                <FaRegThumbsUp className="h-4 w-4" />
              )}
            </button>
            <button
              onClick={handleDislike}
              className={`${liked === false ? 'text-red-500' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'} transition-colors`}
              title="Dislike this response"
            >
              {liked === false ? (
                <FaThumbsDown className="h-4 w-4" />
              ) : (
                <FaRegThumbsDown className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="text-xs opacity-70 font-mono">{formatTime(timestamp)}</p>
        </div>
        {copied && (
          <div className="text-xs text-green-500 mt-1 text-right">Copied to clipboard!</div>
        )}
      </div>
    </div>
  );
});
