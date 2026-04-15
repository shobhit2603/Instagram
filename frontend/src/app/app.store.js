import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/state/auth.slice";
import postsReducer from "../features/posts/state/posts.slice";
import userReducer from "../features/users/state/user.slice";
import chatReducer from "../features/chats/state/chat.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    user: userReducer,
    chats: chatReducer,
  },
});
