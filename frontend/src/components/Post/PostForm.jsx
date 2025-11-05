import React, { useState, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Upload, X, Image as ImageIcon, Video, Smile } from 'lucide-react';
import toast from 'react-hot-toast';
import { createPost, updatePost } from '../../services/postApi';
import { useAuth } from '../../context/AuthContext';
import './PostForm.css';

const PostForm = ({ postToEdit, onSuccess }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(postToEdit?.title || '');
  const [category, setCategory] = useState(postToEdit?.postType || 'Programming');
  const [description, setDescription] = useState(postToEdit?.description || '');
  const [images, setImages] = useState(postToEdit?.images || []);
  const [videos, setVideos] = useState(postToEdit?.videos || []);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

  const validateFileSize = (file, maxSize) => {
    if (file.size > maxSize) {
      const sizeInMB = maxSize / (1024 * 1024);
      throw new Error(`File size exceeds ${sizeInMB}MB limit`);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (files) {
      try {
        const newImages = await Promise.all(
          Array.from(files).map(async (file) => {
            validateFileSize(file, MAX_IMAGE_SIZE);
            const base64 = await convertToBase64(file);
            return base64;
          })
        );
        setImages([...images, ...newImages]);
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error(error.message || 'Error uploading images. Please try again.');
      }
    }
  };

  const handleVideoUpload = async (event) => {
    const files = event.target.files;
    if (files) {
      try {
        const newVideos = await Promise.all(
          Array.from(files).map(async (file) => {
            validateFileSize(file, MAX_VIDEO_SIZE);
            const base64 = await convertToBase64(file);
            return base64;
          })
        );
        setVideos([...videos, ...newVideos]);
      } catch (error) {
        console.error('Error uploading videos:', error);
        toast.error(error.message || 'Error uploading videos. Please try again.');
      }
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const onEmojiClick = (emojiData) => {
    setDescription(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to create a post');
      return;
    }

    setIsSubmitting(true);

    try {
      const postData = {
        title,
        postType: category,
        description,
        images,
        videos,
        visibilityCount: 0,
        userId: user.id
      };

      let response;
      if (postToEdit?.id) {
        response = await updatePost(postToEdit.id, postData);
      } else {
        response = await createPost(postData);
      }
      
      onSuccess(response.data);
      toast.success(postToEdit ? 'Post updated successfully!' : 'Post created successfully!');
      
      if (!postToEdit) {
        setTitle('');
        setCategory('Programming');
        setDescription('');
        setImages([]);
        setVideos([]);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <h2 className="post-form-title">{postToEdit ? 'Edit Post' : 'Create New Post'}</h2>

      <div className="post-form-group">
        <label htmlFor="title" className="form-label">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          required
        />
      </div>

      <div className="post-form-group">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-select"
        >
          <option value="Programming">Programming</option>
          <option value="Cooking">Cooking</option>
          <option value="Photography">Photography</option>
          <option value="Art">Art</option>
          <option value="Music">Music</option>
          <option value="Travel">Travel</option>
          <option value="Fitness">Fitness</option>
          <option value="Technology">Technology</option>
          <option value="Business">Business</option>
          <option value="Gaming">Gaming</option>
          <option value="Fashion">Fashion</option>
          <option value="Health">Health</option>
          <option value="Sports">Sports</option>
        </select>
      </div>

      <div className="post-form-group">
        <label htmlFor="description" className="form-label">
          Description *
        </label>
        <div className="textarea-container">
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            required
          />
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="emoji-button"
          >
            <Smile size={20} />
          </button>
        </div>
        {showEmojiPicker && (
          <div className="emoji-picker">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
      </div>

      <div className="post-form-group">
        <label className="form-label">Images</label>
        {images.length === 0 && (
          <div className="empty-media-message">
            Upload images to make your post more engaging
          </div>
        )}
        <div className="media-grid">
          {images.map((image, index) => (
            <div key={index} className="media-item">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="preview-image"
                onError={(e) => {
                  console.error('Preview image failed to load');
                  e.target.src = 'https://via.placeholder.com/150?text=Preview';
                }}
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="remove-button"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="upload-button"
        >
          <ImageIcon size={20} />
          Upload Images
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden-input"
        />
        {images.length > 0 && (
          <div className="upload-note">
            <small>The first image will be used as the main post image</small>
          </div>
        )}
      </div>

      <div className="post-form-group">
        <label className="form-label">Videos</label>
        <div className="media-grid">
          {videos.map((video, index) => (
            <div key={index} className="media-item">
              <video
                src={video}
                controls
                className="preview-video"
              />
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="remove-button"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className="upload-button"
        >
          <Video size={20} />
          Upload Videos
        </button>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/*"
          multiple
          onChange={handleVideoUpload}
          className="hidden-input"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? (
          <>
            <Upload className="spinner" size={20} />
            Processing...
          </>
        ) : (
          'Publish Post'
        )}
      </button>
    </form>
  );
};

export default PostForm;