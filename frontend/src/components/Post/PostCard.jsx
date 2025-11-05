import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Eye, Calendar, User } from 'lucide-react';
import ReactionBar from '../Reaction/ReactionBar';
import CommentSection from '../Comment/CommentSection';
import './PostCard.css';

const PostCard = ({ post, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(null);

  const user = currentUser || { id: "user123", name: "Current User" };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const getDisplayName = () => {
    if (post.userName) return post.userName;
    if (post.authorName) return post.authorName;
    if (currentUser && post.userId === currentUser.id && currentUser.name) {
      return currentUser.name;
    }
    return `User ${post.userId ? post.userId.substring(0, 5) : 'Unknown'}`;
  };

  // Modal helpers
  const openModal = (index) => setModalImageIndex(index);
  const closeModal = () => setModalImageIndex(null);
  const nextImage = (e) => {
    e.stopPropagation();
    setModalImageIndex((prev) => (prev + 1) % post.images.length);
  };
  const prevImage = (e) => {
    e.stopPropagation();
    setModalImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <div className="post-card-user">
          <User size={24} />
          <span>{getDisplayName()}</span>
        </div>
        <div className="post-card-meta">
          <span className="post-card-type">{post.postType}</span>
          <span className="post-card-date">
            <Calendar size={16} />
            {formatDate(post.timestamp)}
          </span>
          <span className="post-card-views">
            <Eye size={16} />
            {post.visibilityCount || 0}
          </span>
        </div>
      </div>

      <Link to={`/posts/${post.id}`} className="post-card-title-link">
        <h3 className="post-card-title">{post.title}</h3>
      </Link>

      <div className="post-card-description">{post.description}</div>

      {/* Image and Video Grid Section */}
      {(post.images?.length > 0 || post.videos?.length > 0) && (
        <div className="post-card-image-grid">
          {/* Show only the first two images */}
          {post.images?.slice(0, 2).map((imgUrl, index) => (
            <div key={`img-${index}`} className="post-card-image-wrapper">
              <img
                src={imgUrl}
                alt={`Post ${index}`}
                className="post-card-image-multi"
                style={{ cursor: 'pointer' }}
                onClick={() => openModal(index)}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                }}
              />
              {/* Overlay if this is the second image and there are more */}
              {index === 1 && post.images.length > 2 && (
                <div
                  className="image-count-indicator"
                  onClick={() => openModal(index)}
                  style={{ cursor: 'pointer' }}
                  title="View all images"
                >
                  +{post.images.length - 2}
                </div>
              )}
            </div>
          ))}
          {/* Show videos after images */}
          {post.videos?.map((videoUrl, index) => (
            <div key={`vid-${index}`} className="post-card-image-wrapper">
              <video
                src={videoUrl}
                controls
                className="post-card-image-multi"
                style={{ background: "#000" }}
                onError={(e) => {
                  console.error('Video failed to load:', videoUrl);
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Image Modal Overlay with navigation */}
      {modalImageIndex !== null && post.images && (
        <div
          className="image-modal-overlay"
          onClick={closeModal}
          style={{ position: 'fixed' }}
        >
          <button
            className="modal-nav prev"
            onClick={e => {
              e.stopPropagation(); // Prevent closing modal
              prevImage(e);
            }}
            aria-label="Previous image"
            type="button"
          >&#8592;</button>
          <img
            src={post.images[modalImageIndex]}
            alt="Full View"
            className="image-modal-content"
            onClick={e => e.stopPropagation()} // Prevent closing modal
          />
          <button
            className="modal-nav next"
            onClick={e => {
              e.stopPropagation(); // Prevent closing modal
              nextImage(e);
            }}
            aria-label="Next image"
            type="button"
          >&#8594;</button>
        </div>
      )}

      {/* Fallback single image */}
      {post.image && (!post.images || post.images.length === 0) && (
        <div className="post-card-image-container">
          <img
            src={post.image}
            alt={post.title}
            className="post-card-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
            }}
          />
        </div>
      )}

      <ReactionBar postId={post.id} currentUser={user} />

      <div className="post-card-actions">
        <button
          className="post-card-comment-button"
          onClick={toggleComments}
        >
          <MessageSquare size={18} />
          Comments
        </button>
      </div>

      {showComments && (
        <div className="post-card-comments">
          <CommentSection postId={post.id} currentUser={user} />
        </div>
      )}
    </div>
  );
};

export default PostCard;
