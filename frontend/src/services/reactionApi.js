import axios from 'axios';

const API_BASE_URL = 'http://localhost:9006/api/reactions';

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
    console.error('Reaction API Error:', error);
    return Promise.reject(error);
  }
);

export const getReactionsByPostId = (postId) => api.get(`/post/${postId}`);
export const getReactionCounts = (postId) => api.get(`/post/${postId}/counts`);
export const addReaction = (reaction) => api.post('', reaction);
export const removeReaction = (id) => api.delete(`/${id}`);
export const removeUserReaction = (postId, userId) => api.delete(`/post/${postId}/user/${userId}`);
export const hasUserReacted = (postId, userId, reactionType) => 
  api.get(`/post/${postId}/user/${userId}/reacted?reactionType=${reactionType}`);
export const getReactionCount = (postId, reactionType) => 
  api.get(`/post/${postId}/count?reactionType=${reactionType}`); 