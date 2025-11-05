import React from 'react';
import { useCourseContext } from '../context/CourseContext';
import './CourseCard.css'; // Assuming you have a CSS file for styling

const CourseCard = ({ course, onEnroll, isEnrolled }) => {
  const { handleTaskComplete } = useCourseContext();

  const calculateProgress = () => {
    if (!course.levels || course.levels.length === 0) return 0;
    
    const totalTasks = course.levels.reduce((total, level) => 
      total + (level.tasks ? level.tasks.length : 0), 0);
    
    const completedTasks = course.levels.reduce((completed, level) => 
      completed + (level.tasks ? level.tasks.filter(task => task.completed).length : 0), 0);
    
    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const handleTaskClick = async (levelId, taskId, completed) => {
    if (!isEnrolled) return;
    await handleTaskComplete(course.id, levelId, taskId, !completed);
  };

  const progress = calculateProgress();

  return (
    <div className="course-card">
      <div className="course-header">
        <h2>{course.name}</h2>
        <p className="course-description">{course.description}</p>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="progress-text">{progress}% Complete</span>
      </div>

      <div className="course-levels">
        <h3>Levels</h3>
        <ul>
          {course.levels && course.levels.map((level, index) => (
            <li key={level.id || index} className="level-item">
              <span className="level-name">Level {index + 1}: {level.name}</span>
              <ul className="task-list">
                {level.tasks && level.tasks.map((task, taskIndex) => (
                  <li 
                    key={task.id || taskIndex}
                    className={`task-item ${task.completed ? 'completed' : ''} ${isEnrolled ? 'clickable' : ''}`}
                    onClick={() => handleTaskClick(level.id || index, task.id || taskIndex, task.completed)}
                  >
                    {task.name}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <button 
        className={`enroll-button ${isEnrolled ? 'enrolled' : ''}`}
        onClick={() => onEnroll(course)}
        disabled={isEnrolled}
      >
        {isEnrolled ? 'Enrolled' : 'Enroll'}
      </button>
    </div>
  );
};

export default CourseCard; 