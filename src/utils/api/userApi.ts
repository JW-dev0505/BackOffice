import useFCM from "@/utils/hooks/useFCM";

export async function registerUser(username: string, email: string, password: string) {
  const { fcmToken } = useFCM();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      email,
      password,
      fcmToken
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to register user.');
  }

  const data = await response.json();
  return data;
}

export async function getUser(token : string, userid: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userid}`, {
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
  return data;
}

export async function getUsers(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/`, {
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
  return data;
}

export async function updateUser(
  token: string, 
  userid: string, 
  username: string,
  fcmToken: string,
  notificationsEnabled: boolean
) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userid}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`, // Include the JWT in the Authorization header
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    },
    body: JSON.stringify({
      username,
      fcmToken,
      notificationsEnabled
    })
  });
  if (!response.ok) {
    // Handle error response (401, 403, etc.)
    throw new Error('Failed to fetch user data');
  }

  const data = await response.json();
  return data;
}

