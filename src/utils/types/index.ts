export interface User {
  _id: string;
  email: string;
  password: string;
  username: string;
  fcmToken: string;
  notificationsEnabled: boolean;
  isAdmin: boolean;
}

export interface LoginResponseType {
  access_token: string;
  userid: string;
}

export interface Message {
  _id: string;
  title: string;
  body: string;
  createdAt: string;
  isRead: boolean;
}