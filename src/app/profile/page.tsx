"use client"
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import EditProfile from '@/components/EditProfile';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <h1 className="text-2xl font-bold">User Profile</h1>
      {user ? (
        <div className="mt-4">
          <p>Email: {user.email}</p>
          <p>Display Name: {user.username || 'N/A'}</p>
          <button onClick={() => setIsEditing(true)} className="mt-4 bg-blue-500 text-white p-2 rounded">Edit Profile</button>
          {isEditing && (
            <div className="mt-4">
              <EditProfile onClose={() => setIsEditing(false)} />
            </div>
          )}
        </div>
      ) : (
        <p>User not found</p>
      )}
    </div>
  );
};

export default ProfilePage;
