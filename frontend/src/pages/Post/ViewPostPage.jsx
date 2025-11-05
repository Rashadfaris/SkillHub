import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postService } from '../../services/postService';
import PostCard from '../../components/Post/PostCard';
import PostForm from '../../components/Post/PostForm';
import { RefreshCw, Plus, Trash2, Home, BookOpen, User, Settings, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import './ViewPostPage.css';

const ViewPostPage = () => {
  const [editingPost, setEditingPost] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchUserPosts();
  }, [user?.id]);

  const fetchUserPosts = async () => {
    if (!user?.id) {
      setError('You need to be logged in to view your posts');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const posts = await postService.getPostsByUserId(user.id);
      console.log('User posts retrieved:', posts);
      
      // Ensure each post has a userName (might be returned from the backend already)
      const enhancedPosts = posts.map(post => {
        if (!post.userName && user.name) {
          return { ...post, userName: user.name };
        }
        return post;
      });
      
      setUserPosts(enhancedPosts);
      setError(null);
    } catch (err) {
      setError('Failed to load your posts');
      toast.error('Failed to load your posts');
      console.error('Error fetching user posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleDelete = async (postId) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        // Use deletePost from postService
        await postService.deletePost(postId);
        setUserPosts(userPosts.filter(post => post.id !== postId));
        toast.success('Post deleted successfully');
      } catch (error) {
        toast.error('Failed to delete post');
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleSuccess = () => {
    setEditingPost(null);
    fetchUserPosts(); // Refresh posts after edit
  };

  if (loading) {
    return (
      <div className="loading-container">
        <RefreshCw className="animate-spin" size={24} />
        <p className="loading-text">Loading your posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
        <button onClick={fetchUserPosts} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="fixed-layout view-post-page">
      {/* Left Sidebar */}
      <div className="fixed-sidebar left-sidebar">
        <div className="sidebar-user">
          <div className="user-avatar">
            <User size={40} />
          </div>
          <div className="user-info">
            <h3>{user?.name || 'User'}</h3>
            <p>{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        
        <div className="sidebar-nav">
          <Link to="/" className="sidebar-item">
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/my-courses" className="sidebar-item">
            <BookOpen size={20} />
            <span>My Courses</span>
          </Link>
          <Link to="/posts" className="sidebar-item active">
            <Plus size={20} />
            <span>My Posts</span>
          </Link>
          <Link to="/plans" className="sidebar-item">
            <Settings size={20} />
            <span>My Plans</span>
          </Link>
        </div>
        
        <button className="sidebar-logout" onClick={logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
      
      {/* Main Content */}
      <div className="scrollable-content">
        <h2 className="page-title">
          {editingPost ? 'Edit Post' : 'My Posts'}
        </h2>
        {editingPost ? (
          <div className="edit-post-container">
            <button 
              className="back-button"
              onClick={() => setEditingPost(null)}
            >
              ← Back to My Posts
            </button>
            <PostForm postToEdit={editingPost} onSuccess={handleSuccess} />
          </div>
        ) : (
          <div>
            <div className="posts-header">
              <button onClick={fetchUserPosts} className="refresh-button">
                <RefreshCw size={16} />
                Refresh
              </button>
              <Link to="/create" className="create-post-button">
                <Plus size={18} />
                Create New Post
              </Link>
            </div>
            
            {userPosts.length === 0 ? (
              <div className="empty-state">
                <p>You haven't created any posts yet.</p>
                <Link to="/create" className="create-post-button">
                  Create your first post
                </Link>
              </div>
            ) : (
              <div className="user-posts-grid">
                {userPosts.map((post) => (
                  <div key={post.id} className="user-post-container">
                    <div className="user-post-actions">
                      <button 
                        className="edit-post-button" 
                        onClick={() => handleEdit(post)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-post-button" 
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <PostCard 
                      post={post}
                      currentUser={user}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPostPage;