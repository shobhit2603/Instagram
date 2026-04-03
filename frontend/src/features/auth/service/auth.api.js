import axios from "axios";

export async function register({ username, fullName, email, password }) {
  const response = await axios.post(
    "http://localhost:3000/api/auth/register",
    {
      username,
      fullName,
      email,
      password,
    },
    { withCredentials: true },
  );

  return response.data;
}

export async function login({ usernameOrEmail, password }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isEmail = emailRegex.test(usernameOrEmail);

  const response = await axios.post(
    "http://localhost:3000/api/auth/login",
    {
      [isEmail ? "email" : "username"]: usernameOrEmail,
      password,
    },
    { withCredentials: true },
  );
  return response.data;
}

export async function getMe() {
  const response = await axios.get("http://localhost:3000/api/auth/me", {
    withCredentials: true,
  });
  return response.data;
}

export async function logout() {
  const response = await axios.post(
    "http://localhost:3000/api/auth/logout",
    {},
    { withCredentials: true },
  );
  return response.data;
}
