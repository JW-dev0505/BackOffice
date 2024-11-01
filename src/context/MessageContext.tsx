"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getMessages, updateMessage } from '@/utils/api/messageApi';
import { useAuth } from '@/context/AuthContext';
import { Message } from '@/utils/types';
import eventBus from '@/utils/lib/eventBus';

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

  // Calculate unread messages count
  const calculateUnreadCount = (messages: Message[]) => {
    return messages.filter((msg) => !msg.isRead).length;
  };

  // Fetch messages from the API and update state
  const fetchMessages = useCallback(async () => {
    if (user) {
      const token = localStorage.getItem('JWT');
      if (token) {
        const fetchedMessages = await getMessages(token, user._id);
        setMessages(fetchedMessages);
        setUnreadCount(calculateUnreadCount(fetchedMessages));
      }
    }
  }, [user]);

  // Handle event-driven message updates
  useEffect(() => {
    const handleUpdateMessageEvent = async () => {
      await fetchMessages();
      console.log("Messages updated from event.");
    };

    eventBus.on("messageUpdated", handleUpdateMessageEvent);

    return () => {
      eventBus.off("messageUpdated", handleUpdateMessageEvent);
    };
  }, [fetchMessages]);

  // Initial fetch when user changes
  useEffect(() => {
    fetchMessages();
  }, [user, fetchMessages]);

  // Mark message as read and update state
  const checkMessage = async (id: string) => {
    const message = messages.find((msg) => msg._id === id);
    if (message && !message.isRead) {
      await updateMessage(id);
      message.isRead = true;
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
