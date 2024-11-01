import { getUsers, getUser } from "./userApi";
import { User } from "../types";

export async function getMessages(token: string, userid: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/${userid}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  const data = await response.json();
  console.log("get message data : ", data);
  return data;
}

export async function sendNotification(
  token: string,
  userid: string[],
  title: string,
  body: string
) {
  userid.forEach(async (userId) => {
    const user : User = await getUser(token, userId);
    const { fcmToken } = user;

    console.log("send to one data: ", fcmToken,userId, title,body);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/send-notification`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fcmToken,
        userid: userId,
        title,
        body
      })
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const data = await response.json();
    return data;
  });
}

export async function sendNotificationAll(
  token: string,
  title: string,
  body: string
) {
  const users : any[] = await getUsers(token);
  users.forEach(async(user) => {
    const { fcmToken, _id } = user;
    
    console.log("send all data: ", fcmToken,_id, title,body);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/send-notification`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fcmToken,
        _id,
        title,
        body
      })
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    return data;
  });
}

export async function updateMessage(_id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/message/${_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }

  const data = await response.json();
  return data;
}