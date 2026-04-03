import { useDispatch } from "react-redux";
import { setPosts } from "../posts.slice.js";
import { getPosts } from "../service/post.api.js";

export const usePost = () => {
  const dispatch = useDispatch();

  async function handleGetPosts() {
    const data = await getPosts();
    dispatch(setPosts(data.posts));
  }

  return {
    handleGetPosts,
  };
};
