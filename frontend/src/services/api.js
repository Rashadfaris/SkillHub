const API_BASE_URL = 'http://localhost:9006/api';

export const fetchCourses = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const enrollInCourse = async (courseId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to enroll in course');
    }
    return await response.json();
  } catch (error) {
    console.error('Error enrolling in course:', error);
    throw error;
  }
};

export const updateTaskStatus = async (courseId, levelId, taskId, completed) => {
  try {
    const response = await fetch(`${API_BASE_URL}/courses/${courseId}/levels/${levelId}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
      credentials: 'include'
    });
    if (!response.ok) {
      throw new Error('Failed to update task status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating task status:', error);
    throw error;
  }
}; 