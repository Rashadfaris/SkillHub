import React, { useState, useEffect } from 'react';
import { postService } from '../../services/postService';
import { useAuth } from '../../context/AuthContext';
import PostCard from '../../components/Post/PostCard';
import { Plus, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Feed.css';
import toast from 'react-hot-toast';

const Feed = ({ onNewPost }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    // If auth context is not available, create a mock user for development
    const currentUser = user || { id: "user123", name: "Current User" };

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await postService.getAllPosts();
            console.log('All posts retrieved:', data);
            setPosts(data);
            setError(null);
        } catch (err) {
            setError('Failed to load posts');
            toast.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <RefreshCw className="animate-spin" size={24} />
                <p className="loading-text">Loading posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p className="error-text">{error}</p>
                <button onClick={fetchPosts} className="retry-button">
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="feed-container">
            <div className="feed-header">
                <h1 className="feed-title">Latest Posts</h1>
                <div className="feed-actions">
                    {onNewPost && (
                        <button
                            onClick={onNewPost}
                            className="new-post-button"
                        >
                            <Plus size={18} />
                            New Post
                        </button>
                    )}
                    <button
                        onClick={fetchPosts}
                        className="refresh-button"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            {posts.length === 0 ? (
                <div className="empty-state">
                    <p>No posts found.</p>
                    {onNewPost ? (
                        <button onClick={onNewPost} className="create-post-button">
                            Create your first post
                        </button>
                    ) : (
                        <Link to="/post/new" className="create-post-button">
                            Create your first post
                        </Link>
                    )}
                </div>
            ) : (
                <div className="post-grid">
                    {posts.map((post) => (
                        <PostCard 
                            key={post.id} 
                            post={post}
                            currentUser={currentUser}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Feed;