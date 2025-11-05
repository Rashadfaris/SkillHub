import axios from 'axios';

const API_BASE_URL = 'http://localhost:9006/api/posts';

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
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export const getPosts = () => api.get('');
export const getPostById = (id) => api.get(`/${id}`);
export const createPost = (post) => api.post('', post);
export const updatePost = (id, post) => api.put(`/${id}`, post);
export const deletePost = (id) => api.delete(`/${id}`);

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
}; 