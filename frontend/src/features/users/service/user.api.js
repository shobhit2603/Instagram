import axios from "axios";

export async function searchUser({ query }) {
  return axios.get("http://localhost:3000/api/users/search", {
    params: { query },
  });
}

export async function getProfile() {
  const response = await axios.get("http://localhost:3000/api/users/profile", {
    withCredentials: true,
  });
  return response.data;
}

export async function updateProfile(formData) {
  const response = await axios.put(
    "http://localhost:3000/api/users/profile",
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}