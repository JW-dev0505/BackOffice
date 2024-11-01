"use client";
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateUser } from '@/utils/api/userApi';
import { toast } from 'react-toastify';

const EditProfile: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, setUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.username || '');
  const [notificationFlag, setNotificationFlag] = useState(user?.notificationsEnabled || false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      try {
        const token = localStorage.getItem("JWT");

        // If notifications are disabled in the profile, revoke permission
        if (!notificationFlag && Notification.permission === "granted") {
          // Here you would typically unregister the service worker to stop notifications.
          // This could also involve calling a server endpoint to stop sending notifications.
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            await registration.unregister();
            toast.info("Notification permissions revoked.");
          }
        }

        // Update user profile
        const newUser = await updateUser(token!, user._id, displayName, user.fcmToken, notificationFlag);
        setUser(newUser);
        toast.success("Profile updated successfully!");
        onClose(); // Close the modal after updating
      } catch (error) {
        toast.error(`Error updating profile: ${error}`);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium">Notifications Enabled</label>
            <input
              type="checkbox"
              checked={notificationFlag}
              onChange={() => setNotificationFlag(!notificationFlag)}
              className="text-blue-400 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-500 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
