import axios from 'axios';

const API_BASE_URL = 'http://localhost:9006/api/comments';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add a request interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Comment API Error:', error);
    return Promise.reject(error);
  }
);

export const getCommentsByPostId = (postId) => api.get(`/post/${postId}`);
export const addComment = (comment) => api.post('', comment);
export const deleteComment = (id) => api.delete(`/${id}`); 