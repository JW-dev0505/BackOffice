"use client"
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateUser } from '@/utils/api/userApi';
import { toast } from 'react-toastify';

const EditProfile: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.username || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (user) {
      try {
        const token = localStorage.getItem("JWT");
        updateUser(token!, user._id, displayName, user.fcmToken, true);
        toast.success("Profile update successfully!");
        onClose(); // Close the form after updating
      } catch (error) {
        toast.error(`Error updating profile : ${error}`)
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div>
        <label className="block mb-2">Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="border rounded p-2 w-full"
          required
        />
      </div>
      <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Update Profile</button>
      <button type="button" onClick={onClose} className="mt-2 ml-2 bg-gray-500 text-white p-2 rounded">Cancel</button>
    </form>
  );
};

export default EditProfile;
