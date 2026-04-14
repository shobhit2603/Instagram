import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {},
    currentChatId: null,
  },
  reducers: {
    setChats: (state, action) => {
      const users = action.payload || [];
      state.chats = users.reduce((acc, user) => {
        acc[user._id] = user;
        return acc;
      }, {});
    },
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
  },
});

export const { setChats, setCurrentChatId } = chatSlice.actions;
export default chatSlice.reducer;
