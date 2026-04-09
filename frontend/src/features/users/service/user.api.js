import axios from "axios";

export async function searchUser(q) {
  const response = await axios.get("http://localhost:3000/api/users/search", {
    params: { q },
    withCredentials: true,
  });
  return response.data;
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

export async function followUser(userId) {
  const response = await axios.post(`http://localhost:3000/api/users/follow/${userId}`, {}, {
    withCredentials: true,
  });
  return response.data;
}

export async function getFollowRequests() {
  const response = await axios.get("http://localhost:3000/api/users/follow-requests", {
    withCredentials: true,
  });
  return response.data;
}

export async function acceptFollowRequest(requestId) {
  const response = await axios.patch(`http://localhost:3000/api/users/follow-requests/${requestId}/accept`, {}, {
    withCredentials: true,
  });
  return response.data;
}

export async function rejectFollowRequest(requestId) {
  const response = await axios.delete(`http://localhost:3000/api/users/follow-requests/${requestId}/reject`, {
    withCredentials: true,
  });
  return response.data;
}