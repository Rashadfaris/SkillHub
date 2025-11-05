import React from 'react';
import { useCourseContext } from '../../context/CourseContext';
import CourseCard from '../../components/CourseCard';
import '../../styles/App.css'; // Optional, or move LearningProgress-specific styles to a new CSS file

const LearningProgress = () => {
  const { courses, enrolledCourses, loading, error, handleEnroll } = useCourseContext();

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Learning Progress Tracker</h1>
        </header>
        <div className="loading">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Learning Progress Tracker</h1>
        </header>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Learning Progress Tracker</h1>
        {enrolledCourses.length > 0 && (
          <div className="enrolled-courses-info">
            You are enrolled in {enrolledCourses.length} course{enrolledCourses.length !== 1 ? 's' : ''}
          </div>
        )}
      </header>
      <main className="course-grid">
        {courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEnroll={handleEnroll}
              isEnrolled={enrolledCourses.some(c => c.id === course.id)}
            />
          ))
        ) : (
          <div className="no-courses">No courses available</div>
        )}
      </main>
    </div>
  );
};

export default LearningProgress;
