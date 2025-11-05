import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../services/postApi';
import { getCommentsByPostId, addComment, deleteComment } from '../../services/commentApi';
import { getReactionCounts, addReaction } from '../../services/reactionApi';
import { MessageSquare, ThumbsUp, Heart, Award, Trash2, Send } from 'lucide-react';
import './PostDetail.css';
import toast from 'react-hot-toast';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [reactionCounts, setReactionCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mock user data - in a real app, this would come from auth context
  const currentUser = { id: "user123", name: "Current User" };

  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true);
      try {
        const postResponse = await getPostById(id);
        setPost(postResponse.data);
        
        const commentsResponse = await getCommentsByPostId(id);
        setComments(commentsResponse.data);
        
        const reactionsResponse = await getReactionCounts(id);
        setReactionCounts(reactionsResponse.data);
      } catch (err) {
        setError('Failed to load post details');
        toast.error('Failed to load post details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPostData();
  }, [id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      const comment = {
        postId: id,
        userId: currentUser.id,
        content: newComment
      };
      
      const response = await addComment(comment);
      setComments([...comments, response.data]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const handleReaction = async (reactionType) => {
    try {
      const reaction = {
        postId: id,
        userId: currentUser.id,
        reactionType
      };
      
      await addReaction(reaction);
      
      // Refresh reaction counts
      const reactionsResponse = await getReactionCounts(id);
      setReactionCounts(reactionsResponse.data);
      
      toast.success(`${reactionType} reaction toggled`);
    } catch (err) {
      toast.error('Failed to process reaction');
    }
  };

  if (loading) {
    return <div className="loading">Loading post details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!post) {
    return <div className="not-found">Post not found</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="post-detail-container">
      <div className="post-content">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-metadata">
          <span className="post-date">Posted on {formatDate(post.timestamp)}</span>
          <span className="post-author">by User {post.userId}</span>
          <span className="post-type">{post.postType}</span>
        </div>
        
        {post.image && (
          <div className="post-image-container">
            <img src={post.image} alt={post.title} className="post-image" />
          </div>
        )}
        
        <div className="post-description">{post.description}</div>
        
        <div className="reaction-bar">
          <button 
            className={`reaction-button ${reactionCounts['LIKE'] > 0 ? 'active' : ''}`}
            onClick={() => handleReaction('LIKE')}
          >
            <ThumbsUp size={20} />
            <span>{reactionCounts['LIKE'] || 0}</span>
          </button>
          
          <button 
            className={`reaction-button ${reactionCounts['LOVE'] > 0 ? 'active' : ''}`}
            onClick={() => handleReaction('LOVE')}
          >
            <Heart size={20} />
            <span>{reactionCounts['LOVE'] || 0}</span>
          </button>
          
          <button 
            className={`reaction-button ${reactionCounts['CLAP'] > 0 ? 'active' : ''}`}
            onClick={() => handleReaction('CLAP')}
          >
            <Award size={20} />
            <span>{reactionCounts['CLAP'] || 0}</span>
          </button>
        </div>
      </div>
      
      <div className="comments-section">
        <h2 className="comments-title">
          <MessageSquare size={20} />
          Comments ({comments.length})
        </h2>
        
        <div className="comment-input-container">
          <input
            type="text"
            className="comment-input"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          />
          <button className="comment-submit" onClick={handleAddComment}>
            <Send size={20} />
          </button>
        </div>
        
        {comments.length === 0 ? (
          <div className="no-comments">No comments yet. Be the first to comment!</div>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-header">
                  <span className="comment-author">User {comment.userId}</span>
                  <span className="comment-date">{formatDate(comment.timestamp)}</span>
                </div>
                <div className="comment-content">{comment.content}</div>
                {comment.userId === currentUser.id && (
                  <button 
                    className="delete-comment" 
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail; 