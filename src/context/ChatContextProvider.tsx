import { useCallback, useEffect, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ChatContext,
  ChatContextType,
  getIntialChatState,
  ChatStatus,
  Message,
} from './ChatContextValue';

interface ChatProviderProps {
  children: ReactNode;
}

interface MessageDTO {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  files?: File[];
  timestamp: string;
}

const ChatContextProvider = ({ children }: ChatProviderProps) => {
  const [chatState, setChatState] = useState(getIntialChatState());

  // Load previous chat from localStorage on initial render
  useEffect(() => {
    const savedChat = localStorage.getItem('chat_data');
    if (savedChat) {
      try {
        const parsedChat = JSON.parse(savedChat);
        // Convert string dates back to Date objects
        if (parsedChat.state?.messages) {
          parsedChat.state.messages = parsedChat.state.messages.map((msg: MessageDTO) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
        }
        setChatState((prevState) => ({
          ...prevState,
          state: {
            ...prevState.state,
            ...parsedChat.state,
          },
        }));
      } catch (error) {
        console.error('Error parsing saved chat data:', error);
      }
    }
  }, []);

  // Save chat to localStorage when it changes
  useEffect(() => {
    if (chatState.state.messages.length > 0) {
      localStorage.setItem(
        'chat_data',
        JSON.stringify({
          state: chatState.state,
        })
      );
    }
  }, [chatState.state]);

  // Handle sending user messages
  const onUserMessageSend = useCallback((text: string) => {
    // Create new message
    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    // Update state with the new message
    setChatState((prevState) => ({
      ...prevState,
      state: {
        ...prevState.state,
        messages: [...prevState.state.messages, userMessage],
        status: ChatStatus.Typing,
      },
    })); // Set status to waiting for response
    setChatState((prevState) => ({
      ...prevState,
      state: {
        ...prevState.state,
        status: ChatStatus.WaitingForResponse,
      },
    }));

    // Simulate bot response (replace with actual API call)
    setTimeout(() => {
      const botMessage: Message = {
        id: uuidv4(),
        text: `This is a response to: "${text}"`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setChatState((prevState) => ({
        ...prevState,
        state: {
          ...prevState.state,
          messages: [...prevState.state.messages, botMessage],
          status: ChatStatus.Idle,
        },
      }));
    }, 1000);
  }, []);

  // Handle file uploads
  const onFileUpload = useCallback((files: File[]) => {
    const fileMessage: Message = {
      id: uuidv4(),
      text: `Uploaded ${files.length} file(s)`,
      sender: 'user',
      files,
      timestamp: new Date(),
    };

    setChatState((prevState) => ({
      ...prevState,
      state: {
        ...prevState.state,
        messages: [...prevState.state.messages, fileMessage],
        status: ChatStatus.Typing,
      },
    })); // Handle file uploads here...
    // This is just a placeholder for demonstration
    setChatState((prevState) => ({
      ...prevState,
      state: {
        ...prevState.state,
        status: ChatStatus.WaitingForResponse,
      },
    }));

    setTimeout(() => {
      const botResponse: Message = {
        id: uuidv4(),
        text: `Received ${files.length} file(s)`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setChatState((prevState) => ({
        ...prevState,
        state: {
          ...prevState.state,
          messages: [...prevState.state.messages, botResponse],
          status: ChatStatus.Idle,
        },
      }));
    }, 1000);
  }, []);

  // Reset chat function
  const onResetChat = useCallback(() => {
    const freshState = getIntialChatState();
    setChatState(freshState);
    localStorage.removeItem('chat_data');
  }, []); // Final chat context value
  const chatContextValue: ChatContextType = {
    state: chatState.state,
    onUserMessageSend,
    onFileUpload,
    onResetChat,
    // Derive waitingForResponse from status for backward compatibility
    waitingForResponse: chatState.state.status === ChatStatus.WaitingForResponse,
  };

  return <ChatContext.Provider value={chatContextValue}>{children}</ChatContext.Provider>;
};

export default ChatContextProvider;
