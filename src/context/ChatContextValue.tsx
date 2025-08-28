import { createContext } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate a unique session ID
const generateSessionId = (): string => {
  return uuidv4();
};

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  files?: File[];
  timestamp: Date;
}

export enum ChatStatus {
  Idle = 'idle',
  Typing = 'typing',
  Responding = 'responding',
  WaitingForResponse = 'waiting_for_response',
  Error = 'error',
}

export interface ChatState {
  sessionId: string;
  messages: Message[];
  status: ChatStatus;
}

export interface ChatContextType {
  state: ChatState;
  onUserMessageSend: (message: string) => void;
  onFileUpload: (files: File[]) => void;
  onResetChat: () => void;
  // Derived from state.status === ChatStatus.WaitingForResponse
  waitingForResponse: boolean;
}

export const ChatContext = createContext<ChatContextType>({
  state: {
    sessionId: generateSessionId(),
    messages: [],
    status: ChatStatus.Idle,
  },
  onUserMessageSend: () => {},
  onFileUpload: () => {},
  onResetChat: () => {},
  waitingForResponse: false,
});

export const getIntialChatState = (): ChatContextType => {
  return {
    state: {
      sessionId: generateSessionId(),
      messages: [],
      status: ChatStatus.Idle,
    },
    onUserMessageSend: () => {},
    onFileUpload: () => {},
    onResetChat: () => {},
    waitingForResponse: false,
  };
};
