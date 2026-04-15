import { useDispatch } from "react-redux";
import { getChatUsers, getMessages } from "../service/chat.api";
import {
  setChats,
  setCurrentChatId,
  setMessages,
  appendMessage,
} from "../state/chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleGetChatUsers() {
    try {
      const data = await getChatUsers();
      dispatch(setChats(data.users));
    } catch (error) {
      console.error("Failed to fetch chat users:", error);
    }
  }

  function handleSetCurrentChatId(userId) {
    dispatch(setCurrentChatId(userId));
  }

  async function handleGetMessages(userId) {
    try {
      const data = await getMessages(userId);
      dispatch(setMessages({ userId, messages: data.messages }));
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }

  function handleAppendMessage({ chatId, message }) {
    dispatch(appendMessage({ chatId, message }));
  }

  return {
    handleGetChatUsers,
    handleSetCurrentChatId,
    handleGetMessages,
    handleAppendMessage,
  };
};
