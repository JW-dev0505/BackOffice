import { useEffect, useState } from "react";
import { usePathname, useRouter } from 'next/navigation';
import { MessagePayload, onMessage } from "firebase/messaging";
import useFCMToken from "./useFCMToken";
import { messaging } from "@/utils/lib/firebase";
import { toast } from "react-toastify";
import eventBus from "@/utils/lib/eventBus";

const useFCM = () => {
  const fcmToken = useFCMToken();
  const [fcmMessages, setMessages] = useState<MessagePayload[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const fcmmessaging = messaging();
      const unsubscribe = onMessage(fcmmessaging, (payload) => {
        toast.dark(payload.notification?.title);
        if (Notification.permission === 'granted') {
          new Notification(payload.notification?.title!, {
            body: payload.notification?.body,
            icon: payload.notification?.icon,
          });
        }
        eventBus.emit('messageUpdated', { message: 'New Message Arrived!' });
        setMessages((fcmMessages) => [...fcmMessages, payload]);
        if (pathname === '/login') router.refresh();
      });
      return () => unsubscribe();
    }
  }, [fcmToken, pathname, router]);

  return { fcmToken, fcmMessages };
};

export default useFCM;
