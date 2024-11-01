// app/inbox/[id]/page.tsx
'use client';

import { useRouter } from 'next/router';

const messages = {
  1: { title: 'Welcome', content: 'Welcome to our app! Enjoy your stay.', unread: true },
  2: { title: 'Update Available', content: 'Check out the new features in your dashboard.', unread: false },
};

export default function MessageDetail() {
  // const router = useRouter();
  // const { id } = router.query;
  // const message = messages[parseInt(id)] || null;

  // if (!message) return <p>Message not found</p>;

  return (
    <div className="pt-16 p-4">
      {/* <h2 className="text-2xl font-semibold">{message.title}</h2>
      <p className="mt-4">{message.content}</p> */}
    </div>
  );
}
