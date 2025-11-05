import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCourses, enrollInCourse, updateTaskStatus } from '../services/api';

const CourseContext = createContext();

export const useCourseContext = () => useContext(CourseContext);

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await fetchCourses();
      setCourses(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (course) => {
    try {
      if (enrolledCourses.some(c => c.id === course.id)) {
        throw new Error(`You are already enrolled in ${course.name}`);
      }

      await enrollInCourse(course.id);
      setEnrolledCourses(prev => [...prev, course]);
      setCourses(prevCourses => 
        prevCourses.map(c => 
          c.id === course.id ? { ...c, enrolled: true } : c
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTaskComplete = async (courseId, levelId, taskId, completed) => {
    try {
      await updateTaskStatus(courseId, levelId, taskId, completed);
      setCourses(prevCourses => 
        prevCourses.map(course => {
          if (course.id === courseId) {
            return {
              ...course,
              levels: course.levels.map(level => {
                if (level.id === levelId) {
                  return {
                    ...level,
                    tasks: level.tasks.map(task => 
                      task.id === taskId ? { ...task, completed } : task
                    )
                  };
                }
                return level;
              })
            };
          }
          return course;
        })
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const value = {
    courses,
    enrolledCourses,
    loading,
    error,
    handleEnroll,
    handleTaskComplete,
    loadCourses
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
}; 