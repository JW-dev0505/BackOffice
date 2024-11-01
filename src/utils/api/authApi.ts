export async function register(username: string, email: string, password: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      email,
      password
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to register user.');
  }

  const data = await response.json();
  console.log("User registered:", data);
  return data;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to login.');
  }

  const data = await response.json();
  console.log("User Logged in. Token:", data);
  return data;
}

export async function validateUser(email: string, password: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/validateUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Not validate user.');
  }

  const data = await response.json();
  return data;
}
