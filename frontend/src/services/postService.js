import axios from 'axios';

const API_URL = 'http://localhost:9006/api/posts';
const COMMENTS_URL = 'http://localhost:9006/api/comments';
const REACTIONS_URL = 'http://localhost:9006/api/reactions';

// Create axios instance with credentials
const api = axios.create({
    baseURL: 'http://localhost:9006/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

export const postService = {
    getAllPosts: async () => {
        try {
            const response = await api.get('/posts');
            return response.data;
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },

    getPostsByUserId: async (userId) => {
        if (!userId) {
            throw new Error('User ID is required');
        }
        
        try {
            const response = await api.get(`/posts/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching posts for user ${userId}:`, error);
            throw error;
        }
    },

    createPost: async (post) => {
        try {
            // Make a copy of the post data
            const postData = { ...post };
            
            // If there are images in the array, set the first one as the main image
            if (postData.images && postData.images.length > 0 && !postData.image) {
                postData.image = postData.images[0];
            }
            
            // If there's a main image but no images array, initialize it
            if (postData.image && (!postData.images || postData.images.length === 0)) {
                postData.images = [postData.image];
            }
            
            // Log the post data before sending
            console.log('Sending post data:', postData);
            
            const response = await api.post('/posts', postData);
            return response.data;
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    },

    deletePost: async (postId) => {
        if (!postId) {
            throw new Error('Post ID is required');
        }
        
        try {
            await api.delete(`/posts/${postId}`);
            return true;
        } catch (error) {
            console.error(`Error deleting post ${postId}:`, error);
            throw error;
        }
    },

    updatePost: async (postId, post) => {
        try {
            // Make a copy of the post data
            const postData = { ...post };
            
            // If there are images in the array, set the first one as the main image
            if (postData.images && postData.images.length > 0 && !postData.image) {
                postData.image = postData.images[0];
            }
            
            // If there's a main image but no images array, initialize it
            if (postData.image && (!postData.images || postData.images.length === 0)) {
                postData.images = [postData.image];
            }
            
            // Log the post data before sending
            console.log('Updating post data:', postData);
            
            const response = await api.put(`/posts/${postId}`, postData);
            return response.data;
        } catch (error) {
            console.error(`Error updating post ${postId}:`, error);
            throw error;
        }
    },

     // Comments methods
    getCommentsByPostId: async (postId) => {
        if (!postId) {
            throw new Error('Post ID is required');
        }
        try {
            const response = await api.get(`/comments/post/${postId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching comments for post ${postId}:`, error);
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
            } else if (error.request) {
                console.error('No response received from server');
            }
            throw error;
        }
    },

    addComment: async (comment) => {
        try {
            const response = await api.post('/comments', comment);
            return response.data;
        } catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    },

    deleteComment: async (commentId) => {
        try {
            await api.delete(`/comments/${commentId}`);
            return true;
        } catch (error) {
            console.error(`Error deleting comment ${commentId}:`, error);
            throw error;
        }
    },

    updateComment: async (commentId, data) => {
        try {
            const response = await api.put(`/comments/${commentId}`, data);
            return response.data;
        } catch (error) {
            console.error(`Error updating comment ${commentId}:`, error);
            throw error;
        }
    },

    // Reactions methods
    getReactionsByPostId: async (postId) => {
        try {
            const response = await api.get(`/reactions/post/${postId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching reactions for post ${postId}:`, error);
            return [];
        }
    },

    getReactionCounts: async (postId) => {
        try {
            const response = await api.get(`/reactions/post/${postId}/counts`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching reaction counts for post ${postId}:`, error);
            return {};
        }
    },

    addReaction: async (reaction) => {
        try {
            const response = await api.post('/reactions', reaction);
            return response.data;
        } catch (error) {
            console.error('Error adding reaction:', error);
            throw error;
        }
    },
    
    hasUserReacted: async (postId, userId, reactionType) => {
        try {
            const response = await api.get(`/reactions/post/${postId}/user/${userId}/reacted?reactionType=${reactionType}`);
            return response.data;
        } catch (error) {
            console.error(`Error checking if user has reacted:`, error);
            return false;
        }
    }
};