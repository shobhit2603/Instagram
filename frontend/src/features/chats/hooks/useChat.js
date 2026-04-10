import { getChatUsers } from "../service/chat.api";
import { setChats } from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

  const handleGetChatUsers = async () => {
    const data = await getChatUsers();
    dispatch(setChats(data.users));
  };

  return {
    handleGetChatUsers,
  };
};
