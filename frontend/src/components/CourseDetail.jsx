import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import { Home, BookOpen, Calendar, User, Settings, ChevronLeft, LogOut, BookMarked, List, CheckSquare, MessageSquare } from 'lucide-react';
import ReactionBar from '../components/Reaction/ReactionBar';
import CommentSection from '../components/Comment/CommentSection';
import { postService } from '../services/postService';
import '../styles/CourseDetail.css';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolled, setEnrolled] = useState(false);
    const [progress, setProgress] = useState(null);
    const [enrollmentId, setEnrollmentId] = useState(null);
    const [updatingTask, setUpdatingTask] = useState(null);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        loadCourse();
    }, [courseId]);

    const loadCourse = async () => {
        try {
            setLoading(true);
            setError(null);
            const courseData = await courseService.getCourseById(courseId);
            
            if (!courseData) {
                setError('Course not found');
                return;
            }
            
            setCourse(courseData);
            
            if (user?.id) {
                try {
                    const enrollments = await courseService.getUserEnrollments(user.id);
                    const enrollment = enrollments.find(e => e.courseId === courseId);
                    if (enrollment) {
                        setEnrolled(true);
                        setProgress(enrollment.progress);
                        setEnrollmentId(enrollment.id);
                    }
                } catch (enrollError) {
                    console.error('Error fetching enrollment:', enrollError);
                }
            }
        } catch (err) {
            console.error('Error loading course:', err);
            if (err.response?.status === 404) {
                setError('Course not found. It may have been deleted or moved.');
            } else {
                setError('Failed to load course details. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const enrollment = await courseService.enrollInCourse(courseId, user.id);
            setEnrolled(true);
            setProgress(enrollment.progress);
            setEnrollmentId(enrollment.id);
        } catch (err) {
            console.error('Error enrolling in course:', err);
            setError('Failed to enroll in course. Please try again later.');
        }
    };

    const handleTaskCompletion = async (taskId, completed) => {
        if (!enrollmentId) {
            setError('You must be enrolled to track progress');
            return;
        }

        if (!taskId) {
            console.error('Task ID is missing');
            return;
        }

        try {
            setUpdatingTask(taskId);
            const updatedEnrollment = await courseService.updateTaskProgress(
                enrollmentId,
                taskId,
                completed
            );

            if (!updatedEnrollment) {
                throw new Error('Failed to update task progress');
            }

            setProgress(updatedEnrollment.progress);

            // Update the course state to reflect the task completion
            setCourse(prevCourse => ({
                ...prevCourse,
                levels: prevCourse.levels.map(level => ({
                    ...level,
                    tasks: level.tasks.map(task => 
                        task.taskId === taskId 
                            ? { ...task, isCompleted: completed }
                            : task
                    )
                }))
            }));
        } catch (err) {
            console.error('Error updating task progress:', err);
            setError('Failed to update task progress. Please try again.');
        } finally {
            setUpdatingTask(null);
        }
    };

    const isTaskCompleted = (taskId) => {
        if (!taskId || !progress?.completedTasks) return false;
        return progress.completedTasks.includes(taskId);
    };

    if (loading) return (
        <div className="fixed-layout course-detail-layout">
            <div className="fixed-sidebar left-sidebar">
                <SidebarContent user={user} logout={logout} />
            </div>
            <div className="scrollable-content">
                <div className="loading">Loading course details...</div>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="fixed-layout course-detail-layout">
            <div className="fixed-sidebar left-sidebar">
                <SidebarContent user={user} logout={logout} />
            </div>
            <div className="scrollable-content">
                <div className="error-container">
                    <div className="error-message">{error}</div>
                    <div className="error-actions">
                        <button onClick={() => navigate('/')} className="back-button">
                            Back to Courses
                        </button>
                        <button onClick={loadCourse} className="retry-button">
                            Retry Loading
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!course) return null;

    return (
        <div className="fixed-layout course-detail-layout">
            {/* Left Sidebar */}
            <div className="fixed-sidebar left-sidebar">
                <SidebarContent user={user} logout={logout} />
            </div>
            
            {/* Main Content */}
            <div className="scrollable-content">
                <div className="course-detail">
                    <div className="course-header">
                        <button onClick={() => navigate('/courses')} className="back-link">
                            <ChevronLeft size={18} /> Back to Courses
                        </button>
                        <h1>{course.name}</h1>
                    </div>
                    
                    <p className="course-description">{course.description}</p>
                    
                    {enrolled ? (
                        <div className="enrollment-status">
                            <div className="progress-info">
                                <h3>Your Progress</h3>
                                <div className="progress-bar">
                                    <div 
                                        className="progress-fill"
                                        style={{ width: `${progress?.completionPercentage || 0}%` }}
                                    />
                                </div>
                                <span className="progress-text">
                                    {Math.round(progress?.completionPercentage || 0)}% Complete
                                </span>
                                <div className="level-info">
                                    Current Level: {progress?.currentLevel || 1}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={handleEnroll} 
                            className="enroll-button"
                            disabled={!user}
                        >
                            {user ? 'Enroll Now' : 'Login to Enroll'}
                        </button>
                    )}

                    <div className="course-content">
                        <h2>Course Content</h2>
                        {course.levels?.map((level, levelIndex) => (
                            <div 
                                key={`level-${level.levelNumber}-${levelIndex}`}
                                className={`level-section ${level.levelNumber <= (progress?.currentLevel || 1) ? 'unlocked' : 'locked'}`}
                            >
                                <h3>Level {level.levelNumber}: {level.levelName}</h3>
                                <div className="tasks-list">
                                    {level.tasks?.map((task, taskIndex) => (
                                        <div 
                                            key={`task-${task.taskId || taskIndex}`}
                                            className={`task-item ${isTaskCompleted(task.taskId) ? 'completed' : ''}`}
                                        >
                                            <span className="task-name">{task.taskName}</span>
                                            <p className="task-description">{task.taskDescription}</p>
                                            {enrolled && task.taskId && (
                                                <button 
                                                    className={`task-status ${isTaskCompleted(task.taskId) ? 'completed' : ''}`}
                                                    onClick={() => handleTaskCompletion(task.taskId, !isTaskCompleted(task.taskId))}
                                                    disabled={updatingTask === task.taskId || level.levelNumber > (progress?.currentLevel || 1)}
                                                >
                                                    {updatingTask === task.taskId ? 'Updating...' : 
                                                    isTaskCompleted(task.taskId) ? 'Completed' : 'Mark as Complete'}
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Social Features */}
                    <div className="course-social-features">
                        <div className="social-header">
                            <h2>Reactions & Feedback</h2>
                            <p>Share your thoughts about this course or ask questions</p>
                        </div>
                        
                        {/* Reaction Bar */}
                        <div className="reaction-container">
                            <h3>How do you like this course?</h3>
                            <ReactionBar postId={courseId} currentUser={user} />
                        </div>
                        
                        {/* Comments Toggle Button */}
                        <div className="comments-toggle">
                            <button 
                                className="comments-button"
                                onClick={() => setShowComments(!showComments)}
                            >
                                <MessageSquare size={18} />
                                {showComments ? 'Hide Comments' : 'Show Comments'}
                            </button>
                        </div>
                        
                        {/* Comments Section */}
                        {showComments && (
                            <div className="course-comments">
                                <CommentSection postId={courseId} currentUser={user} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Right Sidebar */}
            <div className="fixed-sidebar right-sidebar">
                <div className="sidebar-section">
                    <h3><BookMarked size={18} /> Course Information</h3>
                    <div className="course-info-list">
                        {course.author && (
                            <div className="info-item">
                                <strong>Instructor:</strong> {course.author}
                            </div>
                        )}
                        {course.duration && (
                            <div className="info-item">
                                <strong>Duration:</strong> {course.duration}
                            </div>
                        )}
                        {course.difficulty && (
                            <div className="info-item">
                                <strong>Difficulty:</strong> {course.difficulty}
                            </div>
                        )}
                        <div className="info-item">
                            <strong>Levels:</strong> {course.levels?.length || 0}
                        </div>
                    </div>
                </div>
                
                {enrolled && (
                    <div className="sidebar-section">
                        <h3><CheckSquare size={18} /> Task Summary</h3>
                        <div className="task-summary">
                            <div className="summary-item">
                                <span>Completed Tasks</span>
                                <span className="count">{progress?.completedTasks?.length || 0}</span>
                            </div>
                            <div className="summary-item">
                                <span>Remaining Tasks</span>
                                <span className="count">
                                    {course.levels?.reduce((total, level) => total + (level.tasks?.length || 0), 0) - 
                                    (progress?.completedTasks?.length || 0)}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Separate component for sidebar content to avoid duplication
const SidebarContent = ({ user, logout }) => {
    return (
        <>
            {user && (
                <div className="sidebar-user">
                    <div className="user-avatar">
                        <User size={40} />
                    </div>
                    <div className="user-info">
                        <h3>{user?.name || 'User'}</h3>
                        <p>{user?.email || 'user@example.com'}</p>
                    </div>
                </div>
            )}
            
            <div className="sidebar-nav">
                <Link to="/" className="sidebar-item">
                    <Home size={20} />
                    <span>Dashboard</span>
                </Link>
                <Link to="/courses" className="sidebar-item active">
                    <BookOpen size={20} />
                    <span>Courses</span>
                </Link>
                <Link to="/my-courses" className="sidebar-item">
                    <List size={20} />
                    <span>My Courses</span>
                </Link>
                <Link to="/posts" className="sidebar-item">
                    <BookMarked size={20} />
                    <span>Posts</span>
                </Link>
                <Link to="/plans" className="sidebar-item">
                    <Calendar size={20} />
                    <span>Learning Plans</span>
                </Link>
                <Link to="/settings" className="sidebar-item">
                    <Settings size={20} />
                    <span>Settings</span>
                </Link>
            </div>
            
            {user && (
                <button className="sidebar-logout" onClick={logout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            )}
        </>
    );
};

export default CourseDetail; 