"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import EditProfile from '@/components/EditProfile';

const ProfilePage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user && !loading) router.push('/login');
  }, [user, router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">User Profile</h1>
        {user ? (
          <div>
            <div className="text-center mb-6">
              <p className="text-lg font-semibold text-gray-700">
                <span className="text-gray-500">Email:</span> {user.email}
              </p>
              <p className="text-lg font-semibold text-gray-700 mt-2">
                <span className="text-gray-500">Display Name:</span> {user.username || 'N/A'}
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 text-lg bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition duration-300"
              >
                Edit Profile
              </button>
            </div>
            {isEditing && (
              <div className="mt-6 p-4 bg-gray-100 rounded-md shadow-inner">
                <EditProfile onClose={() => setIsEditing(false)} />
              </div>
            )}
          </div>
        ) : (
          <p className="text-red-500 text-center">User not found</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
