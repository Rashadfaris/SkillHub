import axios from 'axios';

const API_URL = 'http://localhost:9006/api';

export const courseService = {
    // Get all courses
    getAllCourses: async () => {
        const response = await axios.get(`${API_URL}/courses`);
        return response.data;
    },

    // Get course by ID
    getCourseById: async (id) => {
        const response = await axios.get(`${API_URL}/courses/${id}`);
        return response.data;
    },

    // Create new course
    createCourse: async (course) => {
        const response = await axios.post(`${API_URL}/courses`, course);
        return response.data;
    },

    // Update course
    updateCourse: async (id, course) => {
        const response = await axios.put(`${API_URL}/courses/${id}`, course);
        return response.data;
    },

    // Delete course
    deleteCourse: async (id) => {
        await axios.delete(`${API_URL}/courses/${id}`);
    },

    // Enroll in course
    enrollInCourse: async (courseId, userId) => {
        const response = await axios.post(`${API_URL}/courses/${courseId}/enroll/${userId}`);
        return response.data;
    },

    // Get user enrollments
    getUserEnrollments: async (userId) => {
        const response = await axios.get(`${API_URL}/courses/user/${userId}/enrollments`);
        return response.data;
    },

    // Update task progress
    updateTaskProgress: async (enrollmentId, taskId, completed) => {
        try {
            const response = await axios.put(
                `${API_URL}/courses/enrollments/${enrollmentId}/tasks/${taskId}`,
                null,
                {
                    params: { completed }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating task progress:', error);
            throw error;
        }
    }
}; 