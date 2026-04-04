import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/auth.slice";
import postsReducer from "../features/posts/posts.slice";
import userReducer from "../features/users/user.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    user: userReducer,
  },
});