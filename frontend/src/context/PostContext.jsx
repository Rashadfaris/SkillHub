import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPosts, createPost, updatePost, deletePost, uploadImage } from '../services/postApi';

const PostContext = createContext();

export const usePostContext = () => useContext(PostContext);

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      setPosts(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      const response = await createPost(postData);
      setPosts(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleUpdatePost = async (id, postData) => {
    try {
      const response = await updatePost(id, postData);
      setPosts(prev => prev.map(post => 
        post.id === id ? response.data : post
      ));
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id);
      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleUploadImage = async (file) => {
    try {
      const imageUrl = await uploadImage(file);
      return imageUrl;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    posts,
    loading,
    error,
    loadPosts,
    createPost: handleCreatePost,
    updatePost: handleUpdatePost,
    deletePost: handleDeletePost,
    uploadImage: handleUploadImage
  };

  return (
    <PostContext.Provider value={value}>
      {children}
    </PostContext.Provider>
  );
}; 