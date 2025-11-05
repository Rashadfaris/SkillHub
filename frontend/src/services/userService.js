import axios from 'axios';

const API_URL = 'http://localhost:9006/api/users';

// Create axios instance with credentials
const api = axios.create({
    baseURL: 'http://localhost:9006/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Cache for storing user data to avoid repetitive API calls
const userCache = new Map();

export const userService = {
    // Get user by ID
    getUserById: async (userId) => {
        if (!userId) {
            throw new Error('User ID is required');
        }
        
        // Check if we have this user in cache
        if (userCache.has(userId)) {
            return userCache.get(userId);
        }
        
        try {
            const response = await api.get(`/users/${userId}`);
            // Store in cache for future use
            userCache.set(userId, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error fetching user ${userId}:`, error);
            return { name: `User ${userId.substring(0, 5)}` }; // Fallback
        }
    },
    
    // Get all users
    getAllUsers: async () => {
        try {
            const response = await api.get('/users');
            // Update cache with all users
            response.data.forEach(user => {
                userCache.set(user.id, user);
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }
}; 