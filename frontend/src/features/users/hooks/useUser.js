import { useDispatch } from "react-redux";
import { setProfile, setUserPosts, setLoading, setError } from "../user.slice";
import { searchUser, getProfile, updateProfile } from "../service/user.api";
import { setUser } from "../../auth/auth.slice";

export const useUser = () => {
  const dispatch = useDispatch();

  async function handleSearchUser({ query }) {
    const data = await searchUser({ query });
    return data.users;
  }

  async function handleGetProfile() {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await getProfile();
      dispatch(setProfile(data.profile));
      dispatch(setUserPosts(data.posts));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to fetch profile"));
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleUpdateProfile(formData) {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await updateProfile(formData);
      dispatch(setProfile(data.profile));
      // Also update the auth user so navbar/other components reflect changes
      dispatch(setUser({
        id: data.profile.id,
        username: data.profile.username,
        email: data.profile.email,
        fullName: data.profile.fullName,
        profileImage: data.profile.profileImage,
      }));
      return data;
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to update profile"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return { handleSearchUser, handleGetProfile, handleUpdateProfile };
};
