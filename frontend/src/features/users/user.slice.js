import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    userPosts: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setUserPosts: (state, action) => {
      state.userPosts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setProfile, setUserPosts, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
