"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMessages, updateMessage } from '@/utils/api/messageApi';
import { useAuth } from '@/context/AuthContext';
import { Message } from '@/utils/types';
import useFCM from '@/utils/hooks/useFCM';
import { MessagePayload } from 'firebase/messaging';

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
  const { messages: fcmMessages } = useFCM(); // Get messages from FCM

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

  // Effect to handle initial fetch and FCM messages
  useEffect(() => {
    fetchMessages(); // Fetch messages on user change
    // Assuming fcmMessages is of type MessagePayload[]
    if (fcmMessages.length > 0) {
      const lastMessage = fcmMessages[fcmMessages.length - 1]; // Get the last message from the array

      const newMessage = {
        _id: lastMessage.messageId || '', // Default to an empty string if messageId is not available
        title: lastMessage.notification?.title || 'No Title', // Default title if not provided
        body: lastMessage.notification?.body || 'No Body', // Default body if not provided
        createdAt: new Date().toISOString(),
        isRead: false, // Assuming new messages are unread
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]); // Add new message
      setUnreadCount((prevCount) => prevCount + 1); // Increment unread count
    }
  }, [user, fcmMessages]); // Run effect when user or fcmMessages change

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
