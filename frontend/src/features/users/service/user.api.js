import axios from "axios";

export async function searchUser(q) {
  const response = await axios.get("/api/users/search", {
    params: { q },
    withCredentials: true,
  });
  return response.data;
}

export async function getProfile() {
  const response = await axios.get("/api/users/profile", {
    withCredentials: true,
  });
  return response.data;
}

export async function updateProfile(formData) {
  const response = await axios.put(
    "/api/users/profile",
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
  const response = await axios.post(`/api/users/follow/${userId}`, {}, {
    withCredentials: true,
  });
  return response.data;
}

export async function getFollowRequests() {
  const response = await axios.get("/api/users/follow-requests", {
    withCredentials: true,
  });
  return response.data;
}

export async function acceptFollowRequest(requestId) {
  const response = await axios.patch(`/api/users/follow-requests/${requestId}/accept`, {}, {
    withCredentials: true,
  });
  return response.data;
}

export async function rejectFollowRequest(requestId) {
  const response = await axios.delete(`/api/users/follow-requests/${requestId}/reject`, {
    withCredentials: true,
  });
  return response.data;
}