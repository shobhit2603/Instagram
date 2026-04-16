import axios from "axios";

export async function getPosts() {
  const response = await axios.get("/api/posts", {
    withCredentials: true,
  });
  return response.data;
}

export async function createPost(formData, onUploadProgress) {
  const response = await axios.post(
    "/api/posts",
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }
  );
  return response.data;
}
