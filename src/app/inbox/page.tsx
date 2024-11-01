"use client"
import { useEffect, useState } from 'react';
import { getMessages } from '@/utils/api/messageApi';
import { useAuth } from '@/context/AuthContext';

interface Message {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  // Add other message properties here if necessary
}

const InboxPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const _token = localStorage.getItem('JWT');
      if (user && _token) {
        try {
          setLoading(true);
          const fetchedMessages = await getMessages(_token, user._id);
          setMessages(fetchedMessages);
        } catch (err) {
          setError('Failed to load messages');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchMessages();
  }, [user]);

  return (
    <div>
      <h1>Your Inbox</h1>
      {loading ? (
        <p>Loading messages...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {messages.map((message) => (
            <li key={message._id}>
              <h3>{message.title}</h3>
              <p>{message.body}</p>
              <small>Received on: {new Date(message.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InboxPage;
