import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chats",
  initialState: {
    chats: {},
    currentChatId: null,
  },
  reducers: {
    setChats: (state, action) => {
      const users = action.payload;
      state.chats = users.reduce((acc, user) => {
        // Preserve existing messages if user already exists
        acc[user._id] = {
          ...user,
          messages: state.chats[user._id]?.messages || [],
        };
        return acc;
      }, {});
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    setMessages: (state, action) => {
      const { userId, messages } = action.payload;
      if (state.chats[userId]) {
        state.chats[userId].messages = messages.map((msg) => ({
          _id: msg._id,
          content: msg.content,
          sender: msg.sender,
          receiver: msg.receiver,
          createdAt: msg.createdAt,
        }));
      }
    },
    appendMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (state.chats[chatId]) {
        // Avoid duplicates by checking _id
        const exists = state.chats[chatId].messages.some(
          (m) => m._id === message._id
        );
        if (!exists) {
          state.chats[chatId].messages.push(message);
        }
      }
    },
  },
});

export const { setChats, setCurrentChatId, setMessages, appendMessage } =
  chatSlice.actions;
export default chatSlice.reducer;
