import axios from "axios";

export async function getPosts() {
  const response = await axios.get("http://localhost:3000/api/posts", {
    withCredentials: true,
  });
  return response.data;
}

export async function createPost(formData, onUploadProgress) {
  const response = await axios.post(
    "http://localhost:3000/api/posts",
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
