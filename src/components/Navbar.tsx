// Navbar.tsx
"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { useMessage } from '@/context/MessageContext';

const Navbar = () => {
  const { user, isAdmin, removeCurrentUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { unreadCount } = useMessage();

  const handleLogout = async () => {
    try {
      removeCurrentUser();
      toast.success("Successfully logged out!");
      router.push("/login");
    } catch (error) {
      toast.error("Error signing out!");
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
      <Link href="/" className="font-bold text-lg">Back Office</Link>
      <div className="flex space-x-4">
        {user && <Link href="/profile" className={pathname === '/profile' ? 'text-blue-400' : 'text-white'}>Profile</Link>}
        {user && (
          <div className="relative">
            <Link href="/inbox" className={`${pathname === '/inbox' ? 'text-blue-400' : 'text-white'} mr-2`}>
              Inbox
            </Link>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        )}
        {isAdmin && <Link href="/admin" className={pathname === '/admin' ? 'text-blue-400' : 'text-white'}>Admin</Link>}
        {user 
          ? <button onClick={handleLogout}>Logout</button>
          : <Link href="/login" className={pathname === '/login' ? 'text-blue-400' : 'text-white'}>Login</Link>
        }
      </div>
    </nav>
  );
};

export default Navbar;
