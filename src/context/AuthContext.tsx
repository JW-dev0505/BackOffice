"use client"
import { createContext, useContext, useEffect, useState } from 'react';
import { getUser, updateUser } from '@/utils/api/userApi';
import { User } from '@/utils/types';
import useFCM from '@/utils/hooks/useFCM';

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  setCurrentUser: (token: string, userid: string) => void;
  removeCurrentUser: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { fcmToken } = useFCM(); 

  useEffect(() => {
    if (fcmToken) {
      // You can send the token to your backend here
      console.log('FCM Token for sending notifications:', fcmToken);
    }
  }, [fcmToken]);

  useEffect(() => {
    checkUserValidate();
  }, []);

  const checkUserValidate = async () => {
    if (typeof window !== 'undefined') { // Ensure we are in the browser
      const token = localStorage.getItem("JWT");
      const userid = localStorage.getItem("userId");
      
      if (token && userid) {
        try {
          const user: User = await getUser(token, userid);
          setUser(user);
          setIsAdmin(user.isAdmin);
        } catch (error) {
          // If an authentication error occurs, assume token is expired
          console.error("Token expired or authentication failed:", error);
          removeCurrentUser();
        }
      } else {
        removeCurrentUser();
      }
      
      setLoading(false);
    }
  };

  const setCurrentUser = async (token: string, userid: string) => {
    if (typeof window !== 'undefined') { // Ensure we are in the browser
      try {
        // Store token and userId in local storage
        localStorage.setItem("JWT", token);
        localStorage.setItem("userId", userid);
        
        // Fetch user data
        const user: User = await getUser(token, userid);
        
        // Update user with the fetched data and FCM token
        await updateUser(token, userid, user.username, fcmToken!, true);
        
        // Set the user state
        setUser({
          _id: user._id,
          email: user.email,
          fcmToken: fcmToken!,
          isAdmin: user.isAdmin,
          notificationsEnabled: user.notificationsEnabled,
          password: user.password, // Consider whether to expose the password
          username: user.username
        });
        
        setIsAdmin(user.isAdmin);
      } catch (error) {
        console.error("Error setting current user:", error);
        // Handle errors accordingly, e.g., show a message to the user
      } finally {
        setLoading(false);
      }
    }
  };
  

  const removeCurrentUser = () => {
    if (typeof window !== 'undefined') { // Ensure we are in the browser
      localStorage.removeItem("JWT");
      localStorage.removeItem("userId");
    }
    setUser(null);
    setLoading(false);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, setCurrentUser, removeCurrentUser }}>
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
