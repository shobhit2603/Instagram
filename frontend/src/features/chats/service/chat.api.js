import axios from "axios";

const URL = "http://localhost:3000/api/chats";

export const getChatUsers = async () => {
  const response = await axios.get(`${URL}/users`, {
    withCredentials: true,
  });
  return response.data;
};

export const getMessages = async (userId) => {
  const response = await axios.get(`${URL}/messages/${userId}`, {
    withCredentials: true,
  });
  return response.data;
};
