import { getChatUsers } from "../service/chat.api";
import { useDispatch } from "react-redux";
import { setChats, setCurrentChatId } from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleGetChatUsers() {
    const data = await getChatUsers();

    console.log(data.users);

    dispatch(setChats(data.users));
  }

  function handleSetCurrentChatId(userId) {
    dispatch(setCurrentChatId(userId));
  }

  return {
    handleGetChatUsers,
    handleSetCurrentChatId,
  };
};