"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { getUser, updateUser } from '@/utils/api/userApi';
import { User } from '@/utils/types';
import useFCM from '@/utils/hooks/useFCM';
import { toast } from 'react-toastify';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  setCurrentUser: (token: string, userid: string) => void;
  removeCurrentUser: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { fcmToken } = useFCM();

  // Effect to update user with FCM token when available
  useEffect(() => {
    const updateFCMTokenForUser = async () => {
      if (fcmToken && user) {
        const token = localStorage.getItem("JWT");
        const userid = localStorage.getItem("userId");
        if (token && userid) {
          await updateUser(token, userid, user.username, fcmToken, user.notificationsEnabled);
        }
      }
    };
    updateFCMTokenForUser();
  }, [fcmToken, user]);

  // Initial check and validation of user from localStorage
  useEffect(() => {
    const validateUser = async () => {
      setLoading(true);
      const token = localStorage.getItem("JWT");
      const userid = localStorage.getItem("userId");

      if (token && userid) {
        try {
          const fetchedUser: User = await getUser(token, userid);
          setUser(fetchedUser);
          setIsAdmin(fetchedUser.isAdmin);
        } catch (error) {
          console.error("Token expired or authentication failed:", error);
          toast.error("Authentication failed. Please log in again.");
          removeCurrentUser();
        }
      } else {
        removeCurrentUser();
      }
      setLoading(false);
    };
    validateUser();
  }, []);

  const setCurrentUser = async (token: string, userid: string) => {
    setLoading(true);
    try {
      localStorage.setItem("JWT", token);
      localStorage.setItem("userId", userid);

      const fetchedUser: User = await getUser(token, userid);
      setUser({
        ...fetchedUser,
        fcmToken: fcmToken!,
      });

      await updateUser(token, userid, fetchedUser.username, fcmToken!, fetchedUser.notificationsEnabled);
      setIsAdmin(fetchedUser.isAdmin);
    } catch (error) {
      console.error("Error setting current user:", error);
      toast.error("Error setting current user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeCurrentUser = () => {
    localStorage.removeItem("JWT");
    localStorage.removeItem("userId");
    setUser(null);
    setIsAdmin(false);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, setUser, setCurrentUser, removeCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
