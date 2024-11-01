import { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { MessagePayload, onMessage } from "firebase/messaging";
import useFCMToken from "./useFCMToken";
import { messaging } from "@/utils/lib/firebase";
import { toast } from "react-toastify";

const useFCM = () => {
  const fcmToken = useFCMToken();
  const [messages, setMessages] = useState<MessagePayload[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const fcmmessaging = messaging();
      const unsubscribe = onMessage(fcmmessaging, (payload) => {
        toast.dark(payload.notification?.title);
        if (pathname === '/login') router.refresh();
        setMessages((messages) => [...messages, payload]);
      });
      return () => unsubscribe();
    }
  }, [fcmToken, pathname, router]);

  return { fcmToken, messages };
};

export default useFCM;
