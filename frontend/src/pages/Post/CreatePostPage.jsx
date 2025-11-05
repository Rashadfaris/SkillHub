import React, { useState } from 'react';
import PostForm from "../../components/Post/PostForm";
import './CreatePostPage.css';

const CreatePostPage = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleSuccess = () => {
    alert('Post created successfully!');
    setIsFormVisible(false);
  };

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        {!isFormVisible ? (
          <div className="create-post-preview">
            <h2>Share Your Post</h2>
            <p className="create-post-subtitle">Share your thoughts, ideas, or experiences with the community</p>
            <button className="create-post-button" onClick={toggleForm}>
              Create Post
            </button>
          </div>
        ) : (
          <div className="create-post-form-container">
            <div className="create-post-header">
              <h2>Create a New Post</h2>
              <p className="create-post-subtitle">Share your thoughts, ideas, or experiences with the community</p>
            </div>
            <PostForm onSuccess={handleSuccess} />
            <button className="cancel-button" onClick={toggleForm}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostPage;