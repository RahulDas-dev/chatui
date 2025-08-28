import { useContext } from 'react';
import { ChatContext } from '../context/ChatContextValue';

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
