"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMessage } from '@/context/MessageContext';
import { useAuth } from '@/context/AuthContext';
import MessageModal from '@/components/MessageModal';
import { Message } from '@/utils/types';

const InboxPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { messages, checkMessage } = useMessage();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!user) router.push('/login');
  }, [user, router]);

  const handleCheckMessage = async (id: string) => {
    const message = messages.find((msg) => msg._id === id);
    if (message) {
      setSelectedMessage(message);
      setIsModalOpen(true);
    }
    await checkMessage(id);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500 flex flex-col items-center py-8 px-4">
      <h1 className="text-4xl font-bold text-white mb-6">Your Inbox</h1>
      
      <div className="grid gap-6 w-full max-w-3xl">
        {messages.map((message) => (
          <div key={message._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative" onClick={() => handleCheckMessage(message._id)}>
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
      {isModalOpen && selectedMessage && (
        <MessageModal message={selectedMessage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default InboxPage;
