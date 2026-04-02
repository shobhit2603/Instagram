import axios from "axios";

export async function searchUser({ query }) {
  return axios.get("http://localhost:3000/api/users/search", {
    params: { query },
  });
}