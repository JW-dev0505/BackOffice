"use client"
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getUsers } from '@/utils/api/userApi';
import { User } from '@/utils/types';
import { useAuth } from '@/context/AuthContext';
import { sendNotification, sendNotificationAll } from '@/utils/api/messageApi';


const AdminPanel = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [targetUsers, setTargetUsers] = useState('all'); // or 'specific'
  const [users, setUsers] = useState<User[]>([]); // All users from the DB
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]); // IDs of selected users
  const [token, setToken] = useState<string|null>(null);

  // Fetch users from the database on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      const _token = localStorage.getItem('JWT');
      setToken(_token);
      try {
        const fetchedUsers = await getUsers(_token!); // Fetch users with your token
        setUsers(fetchedUsers);
      } catch (error: any) {
        toast.error(`Failed to load users: ${error.message}`);
      }
    };

    fetchUsers();
  }, [user]);

  // Handle send message to users
  const sendMessageToUsers = async (message: string, targetUsers: string) => {
    console.log("send target : ", token);
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

  // Handle form submission
  const handleBroadcastMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessageToUsers(message, targetUsers);
    setMessage('');
  };

  // Toggle user selection
  const handleUserSelection = (userId: string) => {
    setSelectedUserIds((prevIds) =>
      prevIds.includes(userId)
        ? prevIds.filter((id) => id !== userId)
        : [...prevIds, userId]
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <form onSubmit={handleBroadcastMessage} className="mt-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Compose your message"
          className="border p-2 w-full"
          required
        />
        <div className="mt-2">
          <label>
            <input
              type="radio"
              value="all"
              checked={targetUsers === 'all'}
              onChange={() => setTargetUsers('all')}
            />
            Send to All Users
          </label>
          <label className="ml-4">
            <input
              type="radio"
              value="specific"
              checked={targetUsers === 'specific'}
              onChange={() => setTargetUsers('specific')}
            />
            Send to Specific Users
          </label>
        </div>

        {targetUsers === 'specific' && (
          <div className="mt-4">
            <h2 className="font-semibold">Select Users:</h2>
            <div className="flex flex-wrap">
              {users.map((user, index) => (
                <label key={index} className="mr-4">
                  <input
                    type="checkbox"
                    value={user._id}
                    checked={selectedUserIds.includes(user._id)}
                    onChange={() => handleUserSelection(user._id)}
                  />
                  {user.username}
                </label>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="bg-blue-500 text-white p-2 mt-4 rounded">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
