import { useDispatch } from "react-redux";
import { setPosts } from "../posts.slice.js";
import { getPosts, createPost } from "../service/post.api.js";

export const usePost = () => {
  const dispatch = useDispatch();

  async function handleGetPosts() {
    const data = await getPosts();
    dispatch(setPosts(data.posts));
  }

  async function handleCreatePost(formData, onUploadProgress) {
    const data = await createPost(formData, onUploadProgress);
    return data;
  }

  return {
    handleGetPosts,
    handleCreatePost,
  };
};
