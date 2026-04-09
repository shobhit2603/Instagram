import { useDispatch } from "react-redux";
import { useCallback } from "react"; // Import useCallback
import { setProfile, setUserPosts, setFollowRequests, removeFollowRequest, setLoading, setError } from "../user.slice";
import { searchUser, getProfile, updateProfile, followUser, getFollowRequests, acceptFollowRequest, rejectFollowRequest } from "../service/user.api";
import { setUser } from "../../auth/auth.slice";

export const useUser = () => {
  const dispatch = useDispatch();

  // Wrap in useCallback to stabilize the reference
  const handleSearchUser = useCallback(async (query) => {
    const data = await searchUser(query);
    return data.users;
  }, []);

  const handleFollowUser = useCallback(async (userId) => {
    try {
      dispatch(setLoading(true));
      const response = await followUser(userId);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleGetFollowRequests = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const response = await getFollowRequests();
      if (response.success) {
        dispatch(setFollowRequests(response.requests));
      }
      return response;
    } catch (error) {
      dispatch(setError(error.message || "Failed to fetch follow requests"));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleAcceptFollowRequest = useCallback(async (requestId) => {
    try {
      const response = await acceptFollowRequest(requestId);
      if (response.success) {
        dispatch(removeFollowRequest(requestId));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [dispatch]);

  const handleRejectFollowRequest = useCallback(async (requestId) => {
    try {
      const response = await rejectFollowRequest(requestId);
      if (response.success) {
        dispatch(removeFollowRequest(requestId));
      }
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, [dispatch]);

  const handleGetProfile = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const data = await getProfile();
      dispatch(setProfile(data.profile));
      dispatch(setUserPosts(data.posts));
      return data;
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch profile"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const handleUpdateProfile = useCallback(
    async (formData) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const data = await updateProfile(formData);
        dispatch(setProfile(data.profile));
        // Also update the auth user so navbar/other components reflect changes
        dispatch(
          setUser({
            id: data.profile.id,
            username: data.profile.username,
            email: data.profile.email,
            fullName: data.profile.fullName,
            profileImage: data.profile.profileImage,
          }),
        );
        return data;
      } catch (error) {
        dispatch(
          setError(error.response?.data?.message || "Failed to update profile"),
        );
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  return {
    handleSearchUser,
    handleGetProfile,
    handleUpdateProfile,
    handleFollowUser,
    handleGetFollowRequests,
    handleAcceptFollowRequest,
    handleRejectFollowRequest
  };
};
