import { memo } from 'react';
import { useChatContext } from '../hooks/useChatContext';
import { UserMessage } from './UserMessage';
import { BotMessage } from './BotMessage';
import { TypingMessage } from './TypingMessage';

// Typing indicator variants supported by our component
type TypingVariant = 'spinner' | 'dots' | 'classic' | 'minimal';

interface MessageAreaProps {
  typingIndicator?: TypingVariant;
}

export const MessageArea = memo(({ typingIndicator = 'spinner' }: MessageAreaProps) => {
  const { state, waitingForResponse } = useChatContext();
  return (
    <div className="w-full p-4">
      <div className="space-y-3">
        {state.messages.map((message) =>
          message.sender === 'user' ? (
            <UserMessage key={message.id} text={message.text} timestamp={message.timestamp} />
          ) : (
            <BotMessage key={message.id} text={message.text} timestamp={message.timestamp} />
          )
        )}
        {waitingForResponse && <TypingMessage variant={typingIndicator} />}
      </div>
    </div>
  );
});
