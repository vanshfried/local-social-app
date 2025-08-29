import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL || ""}/api`,
});

// Posts
export const fetchPosts = () => API.get("/posts");
export const createPost = (formData, token) =>
  API.post("/posts", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

// Communities
export const fetchCommunities = (token) =>
  API.get("/communities", {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });

export const joinCommunityAPI = (communityId, token) =>
  API.post(
    `/communities/${communityId}/join`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );

// Auth
export const loginUser = (credentials) => API.post("/auth/login", credentials);
export const signupUser = (credentials) => API.post("/auth/signup", credentials);

export default API;
