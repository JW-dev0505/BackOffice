// app/layout.tsx
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/context/AuthContext';
import { MessageProvider } from '@/context/MessageContext';
import { ToastContainer, Zoom } from 'react-toastify';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MessageProvider>
        <html lang="en">
          <body>
            <Navbar />
            <main>{children}</main>
            <ToastContainer 
              autoClose={2000}
              transition={Zoom}
              hideProgressBar={false}
            />
          </body>
        </html>
      </MessageProvider>
    </AuthProvider>
  );
}
