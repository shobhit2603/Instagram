import axios from "axios";

export async function register({ username, email, fullname, password }) {
  const response = await axios.post(
    "http://localhost:3000/api/auth/register",
    {
      username,
      email,
      fullName: fullname,
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
