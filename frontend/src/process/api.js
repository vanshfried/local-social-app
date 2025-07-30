import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
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

// Auth (example)
export const loginUser = (credentials) => API.post("/auth/login", credentials);
export const signupUser = (credentials) => API.post("/auth/signup", credentials);
