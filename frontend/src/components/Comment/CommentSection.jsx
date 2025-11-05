import { useState, useEffect } from 'react';
import { postService } from '../../services/postService';
import { MessageSquare, Trash2, Send, Edit2, CornerDownRight } from 'lucide-react';
import './CommentSection.css';
import toast from 'react-hot-toast';

const CommentSection = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  // Reply state
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) {
        setError('Invalid post ID');
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const commentsData = await postService.getCommentsByPostId(postId);
        setComments(commentsData || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [postId]);

  // Add new comment (top-level)
  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!currentUser?.id) {
      toast.error('Please log in to add comments');
      return;
    }
    try {
      const comment = {
        postId,
        userId: currentUser.id,
        content: newComment,
        parentId: null
      };
      const newCommentData = await postService.addComment(comment);
      const commentWithUser = {
        ...newCommentData,
        userName: currentUser.name || `User ${currentUser.id.substring(0, 5)}`
      };
      setComments([...comments, commentWithUser]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  // Delete comment (and its replies)
  const handleDeleteComment = async (commentId) => {
    try {
      await postService.deleteComment(commentId);
      // Remove comment and its replies from UI
      setComments(comments.filter(comment => comment.id !== commentId && comment.parentId !== commentId));
      toast.success('Comment deleted successfully');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  // Start editing
  const handleEditClick = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // Save edit
  const handleEditSave = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      const updated = await postService.updateComment(commentId, { content: editContent });
      setComments(comments.map(c => c.id === commentId ? { ...c, content: updated.content, timestamp: updated.timestamp } : c));
      setEditingId(null);
      setEditContent('');
      toast.success('Comment updated');
    } catch (err) {
      toast.error('Failed to update comment');
    }
  };

  // Cancel edit
  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  // Start replying
  const handleReplyClick = (commentId) => {
    setReplyingToId(commentId);
    setReplyContent('');
  };

  // Submit reply
  const handleReplySubmit = async (parentId) => {
    if (!replyContent.trim()) return;
    if (!currentUser?.id) {
      toast.error('Please log in to reply');
      return;
    }
    try {
      const reply = {
        postId,
        userId: currentUser.id,
        content: replyContent,
        parentId
      };
      const newReply = await postService.addComment(reply);
      setComments([...comments, { ...newReply, userName: currentUser.name }]);
      setReplyingToId(null);
      setReplyContent('');
      toast.success('Reply added');
    } catch (err) {
      toast.error('Failed to add reply');
    }
  };

  // Group comments: top-level and replies
  const topLevelComments = comments.filter(c => !c.parentId);
  const repliesFor = (parentId) => comments.filter(c => c.parentId === parentId);

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

  const getCommentAuthorName = (comment) => {
    if (comment.userName) return comment.userName;
    if (comment.authorName) return comment.authorName;
    return `User ${comment.userId.substring(0, 5)}`;
  };

  if (loading) {
    return <div className="comments-loading">Loading comments...</div>;
  }
  if (error) {
    return <div className="comments-error">{error}</div>;
  }

  return (
    <div className="comments-section">
      <h2 className="comments-title">
        <MessageSquare size={20} />
        Comments ({topLevelComments.length})
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
        <button
          className="comment-submit"
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Send size={20} />
        </button>
      </div>
      {topLevelComments.length === 0 ? (
        <div className="no-comments">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="comments-list">
          {topLevelComments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{getCommentAuthorName(comment)}</span>
                <span className="comment-date">{formatDate(comment.timestamp)}</span>
              </div>
              {editingId === comment.id ? (
                <div className="comment-edit">
                  <input
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="comment-edit-input"
                  />
                  <button onClick={() => handleEditSave(comment.id)} className="comment-save-btn">Save</button>
                  <button onClick={handleEditCancel} className="comment-cancel-btn">Cancel</button>
                </div>
              ) : (
                <div className="comment-content">{comment.content}</div>
              )}
              <div className="comment-actions">
                <button className="reply-comment" onClick={() => handleReplyClick(comment.id)}>
                  <CornerDownRight size={16} /> Reply
                </button>
                {comment.userId === currentUser?.id && (
                  <>
                    <button className="edit-comment" onClick={() => handleEditClick(comment)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="delete-comment" onClick={() => handleDeleteComment(comment.id)}>
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
              {/* Reply input */}
              {replyingToId === comment.id && (
                <div className="reply-input-container">
                  <input
                    type="text"
                    className="reply-input"
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleReplySubmit(comment.id)}
                  />
                  <button onClick={() => handleReplySubmit(comment.id)} className="reply-submit-btn" disabled={!replyContent.trim()}>
                    <Send size={16} />
                  </button>
                  <button onClick={() => setReplyingToId(null)} className="reply-cancel-btn">Cancel</button>
                </div>
              )}
              {/* Replies */}
              <div className="comment-replies">
                {repliesFor(comment.id).map(reply => (
                  <div key={reply.id} className="comment-reply-item">
                    <div className="comment-header">
                      <span className="comment-author">{getCommentAuthorName(reply)}</span>
                      <span className="comment-date">{formatDate(reply.timestamp)}</span>
                    </div>
                    {editingId === reply.id ? (
                      <div className="comment-edit">
                        <input
                          value={editContent}
                          onChange={e => setEditContent(e.target.value)}
                          className="comment-edit-input"
                        />
                        <button onClick={() => handleEditSave(reply.id)} className="comment-save-btn">Save</button>
                        <button onClick={handleEditCancel} className="comment-cancel-btn">Cancel</button>
                      </div>
                    ) : (
                      <span className="comment-content">{reply.content}</span>
                    )}
                    {reply.userId === currentUser?.id && (
                      <div className="comment-actions">
                        <button className="edit-comment" onClick={() => handleEditClick(reply)}>
                          <Edit2 size={14} />
                        </button>
                        <button className="delete-comment" onClick={() => handleDeleteComment(reply.id)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;