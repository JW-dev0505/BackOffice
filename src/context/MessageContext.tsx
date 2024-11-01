"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMessages, updateMessage } from '@/utils/api/messageApi';
import { useAuth } from '@/context/AuthContext';
import { Message } from '@/utils/types';
import useFCM from '@/utils/hooks/useFCM';

interface MessageContextType {
  messages: Message[];
  unreadCount: number;
  fetchMessages: () => Promise<void>;
  checkMessage: (id: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { fcmMessages } = useFCM();

  // Effect to handle initial fetch and FCM messages
  useEffect(() => {
    fetchMessages(); // Fetch messages on user change}
  }, [user, fcmMessages]);
    
  const fetchMessages = async () => {
    if (user) {
      const _token = localStorage.getItem('JWT');
      const fetchedMessages = await getMessages(_token!, user._id);
      setMessages(fetchedMessages);
      setUnreadCount(fetchedMessages.filter((msg: Message) => !msg.isRead).length);
    }
  };

  const checkMessage = async (id: string) => {
    const message = messages.find((msg) => msg._id === id);
    if (message && !message.isRead) {
      await updateMessage(id); // Call API to update message status
      message.isRead = true; // Update locally
      setMessages([...messages]);
      setUnreadCount(unreadCount - 1);
    }
  };

  return (
    <MessageContext.Provider value={{ messages, unreadCount, fetchMessages, checkMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};
