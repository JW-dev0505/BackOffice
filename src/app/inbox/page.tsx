"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMessages, updateMessage } from '@/utils/api/messageApi';
import { useAuth } from '@/context/AuthContext';

interface Message {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
}

const InboxPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  useEffect(() => {
    const fetchMessages = async () => {
      const _token = localStorage.getItem('JWT');
      if (user && _token) {
        try {
          setLoading(true);
          const fetchedMessages = await getMessages(_token, user._id);
          setMessages(fetchedMessages);
          
          // Automatically mark unread messages as read on load
          fetchedMessages.forEach(async (message : Message) => {
            if (!message.isRead) {
              await updateMessage(message._id); // Update isRead status
              message.isRead = true; // Mark locally as read after updating
            }
          });
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
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500 flex flex-col items-center py-8 px-4">
      <h1 className="text-4xl font-bold text-white mb-6">Your Inbox</h1>
      
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-white h-12 w-12"></div>
          <p className="text-white text-lg ml-4">Loading messages...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      ) : (
        <div className="grid gap-6 w-full max-w-3xl">
          {messages.map((message) => (
            <div key={message._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative">
              <h3 className="text-2xl font-semibold text-blue-700">{message.title}</h3>
              <p className="text-gray-700 mt-2">{message.body}</p>
              <small className="text-gray-500 mt-4 block">Received on: {new Date(message.createdAt).toLocaleString()}</small>
              <span 
                className={`absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full 
                  ${message.isRead ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {message.isRead ? 'Read' : 'Unread'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InboxPage;
