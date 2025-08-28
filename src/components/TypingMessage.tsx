import { memo } from 'react';
import { useTheme } from '../hooks/useTheme';
import { TypingIndicator } from './TypingIndicator';

type TypingVariant = 'spinner' | 'dots' | 'classic' | 'minimal';

interface TypingMessageProps {
  variant?: TypingVariant;
}

export const TypingMessage = memo(({ variant = 'spinner' }: TypingMessageProps) => {
  const { isDark } = useTheme();
  const botMessageBg = isDark ? 'bg-zinc-700' : 'bg-white';

  return (
    <div className="flex justify-start">
      <div
        className={`max-w-[75%] rounded-lg p-3 ${botMessageBg} text-zinc-800 dark:text-zinc-100`}
      >
        <TypingIndicator variant={variant} />
      </div>
    </div>
  );
});
