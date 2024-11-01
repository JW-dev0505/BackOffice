export interface User {
  _id: string;
  email: string;
  password: string;
  username: string;
  fcmToken: string;
  notificationsEnabled: boolean;
  isAdmin: boolean;
}

export interface Message {
  title: string;
  body: string;
  username: string;
  isRead: boolean;
}

export interface LoginResponseType {
  access_token: string;
  userid: string;
}