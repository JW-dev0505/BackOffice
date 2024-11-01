"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { getUsers } from '@/utils/api/userApi';
import { User } from '@/utils/types';
import { useAuth } from '@/context/AuthContext';
import { sendNotification, sendNotificationAll } from '@/utils/api/messageApi';

const AdminPanel = () => {
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [targetUsers, setTargetUsers] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!user) router.push('/login');
    else if (!isAdmin) router.push('/');
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const _token = localStorage.getItem('JWT');
      setToken(_token);
      try {
        const fetchedUsers = await getUsers(_token!);
        setUsers(fetchedUsers);
      } catch (error: any) {
        toast.error(`Failed to load users: ${error.message}`);
      }
    };
    fetchUsers();
  }, [user]);

  const sendMessageToUsers = async (message: string, targetUsers: string) => {
    try {
      if (targetUsers === 'all') {
        await sendNotificationAll(token!, 'Broadcast Message', message);
      } else {
        await sendNotification(token!, selectedUserIds, 'Targeted Message', message);
      }
      toast.success('Message sent successfully!');
    } catch (error: any) {
      toast.error(`Failed to send message: ${error.message}`);
    }
  };

  const handleBroadcastMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessageToUsers(message, targetUsers);
    setMessage('');
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUserIds((prevIds) =>
      prevIds.includes(userId) ? prevIds.filter((id) => id !== userId) : [...prevIds, userId]
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-gray-100 p-8">
      <div className="bg-gray-700 rounded-lg shadow-xl p-6 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">Admin Panel</h1>
        <form onSubmit={handleBroadcastMessage}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Compose your message"
            className="border rounded p-4 w-full h-32 bg-gray-800 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="flex mt-4 items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="all"
                checked={targetUsers === 'all'}
                onChange={() => setTargetUsers('all')}
                className="text-blue-400 focus:ring-blue-500"
              />
              <span>Send to All Users</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="specific"
                checked={targetUsers === 'specific'}
                onChange={() => setTargetUsers('specific')}
                className="text-blue-400 focus:ring-blue-500"
              />
              <span>Send to Specific Users</span>
            </label>
          </div>

          {targetUsers === 'specific' && (
            <div className="mt-4">
              <h2 className="font-semibold mb-2">Select Users:</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-800 p-4 rounded-lg">
                {users.map((user, index) => (
                  <label key={index} className="flex items-center space-x-2 text-gray-300">
                    <input
                      type="checkbox"
                      value={user._id}
                      checked={selectedUserIds.includes(user._id)}
                      onChange={() => handleUserSelection(user._id)}
                      className="text-blue-400 focus:ring-blue-500"
                    />
                    <span>{user.username}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 mt-6 rounded-lg transition duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
