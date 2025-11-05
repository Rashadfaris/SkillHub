import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import { Home, BookOpen, Calendar, User, Settings, LogOut, BookMarked, List, CheckSquare } from 'lucide-react';
import '../styles/MyCourses.css';

const MyCourses = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Sample course images - in a real app, these would come from your API
    const courseImages = {
        default: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        programming: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        design: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        business: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    };

    const getCourseImage = (course) => {
        if (!course) return courseImages.default;
        if (course.image) return course.image; // If course has an image property, use it
        
        // Otherwise determine image based on category
        if (course.category === 'Programming') return courseImages.programming;
        if (course.category === 'Design') return courseImages.design;
        if (course.category === 'Business') return courseImages.business;
        
        return courseImages.default;
    };

    useEffect(() => {
        if (user?.id) {
            fetchEnrolledCourses();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchEnrolledCourses = async () => {
        try {
            const enrollmentsData = await courseService.getUserEnrollments(user.id);
            setEnrollments(enrollmentsData);

            // Fetch course details for each enrollment
            const coursesData = await Promise.all(
                enrollmentsData.map(enrollment =>
                    courseService.getCourseById(enrollment.courseId)
                )
            );
            setCourses(coursesData);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch enrolled courses');
            setLoading(false);
        }
    };

    const getCourseProgress = (courseId) => {
        const enrollment = enrollments.find(e => e.courseId === courseId);
        return enrollment?.progress?.completionPercentage || 0;
    };

    const getCompletedTasks = (courseId) => {
        const enrollment = enrollments.find(e => e.courseId === courseId);
        return enrollment?.progress?.completedTasks?.length || 0;
    };

    const getTotalTasks = (course) => {
        return course.levels?.reduce(
            (total, level) => total + (level.tasks?.length || 0),
            0
        ) || 0;
    };

    if (loading) return (
        <div className="fixed-layout course-detail-layout">
            <div className="fixed-sidebar left-sidebar">
                <SidebarContent user={user} logout={logout} />
            </div>
            <div className="scrollable-content">
                <div className="loading">Loading your courses...</div>
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
                            Back to Dashboard
                        </button>
                        <button onClick={fetchEnrolledCourses} className="retry-button">
                            Retry Loading
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    
    if (!user) return (
        <div className="fixed-layout course-detail-layout">
            <div className="fixed-sidebar left-sidebar">
                <SidebarContent user={null} logout={null} />
            </div>
            <div className="scrollable-content">
                <div className="error-container">
                    <div className="error-message">Please log in to view your courses</div>
                    <div className="error-actions">
                        <button onClick={() => navigate('/login')} className="back-button">
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed-layout course-detail-layout">
            {/* Left Sidebar */}
            <div className="fixed-sidebar left-sidebar">
                <SidebarContent user={user} logout={logout} />
            </div>
            
            {/* Main Content */}
            <div className="scrollable-content">
                <div className="my-courses-content">
                    <h1>My Courses</h1>
                    {courses.length > 0 ? (
                        <div className="course-grid">
                            {courses.map((course) => (
                                <div key={course.id} className="course-card">
                                    <div className="course-card-image-container">
                                        <img
                                            src={getCourseImage(course)}
                                            alt={course.name}
                                            className="course-card-image"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = courseImages.default;
                                            }}
                                        />
                                    </div>
                                    <h2>{course.name}</h2>
                                    <p>{course.description}</p>
                                    <div className="progress-info">
                                        <div className="progress-bar">
                                            <div 
                                                className="progress-fill"
                                                style={{ width: `${getCourseProgress(course.id)}%` }}
                                            />
                                        </div>
                                        <span>{getCourseProgress(course.id)}% Complete</span>
                                    </div>
                                    <div className="task-info">
                                        <span>{getCompletedTasks(course.id)} of {getTotalTasks(course)} tasks completed</span>
                                    </div>
                                    <Link to={`/courses/${course.id}`} className="view-course-btn">
                                        Continue Learning
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-courses">
                            <img 
                                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                                alt="No courses" 
                                className="empty-state-icon"
                                width="120"
                            />
                            <p>You haven't enrolled in any courses yet.</p>
                            <Link to="/courses" className="browse-courses-btn">
                                Browse Courses
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Right Sidebar */}
            <div className="fixed-sidebar right-sidebar">
                <div className="sidebar-section">
                    <h3><BookMarked size={18} /> Learning Statistics</h3>
                    <div className="course-info-list">
                        <div className="info-item">
                            <strong>Enrolled Courses:</strong> {courses.length}
                        </div>
                        <div className="info-item">
                            <strong>In Progress:</strong> {courses.filter(c => getCourseProgress(c.id) > 0 && getCourseProgress(c.id) < 100).length}
                        </div>
                        <div className="info-item">
                            <strong>Completed:</strong> {courses.filter(c => getCourseProgress(c.id) === 100).length}
                        </div>
                    </div>
                </div>
                
                {courses.length > 0 && (
                    <div className="sidebar-section">
                        <h3><CheckSquare size={18} /> Progress Summary</h3>
                        <div className="task-summary">
                            <div className="summary-item">
                                <span>Total Tasks</span>
                                <span className="count">
                                    {courses.reduce((total, course) => total + getTotalTasks(course), 0)}
                                </span>
                            </div>
                            <div className="summary-item">
                                <span>Completed Tasks</span>
                                <span className="count">
                                    {enrollments.reduce((total, enrollment) => 
                                        total + (enrollment.progress?.completedTasks?.length || 0), 0)}
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
                <Link to="/courses" className="sidebar-item">
                    <BookOpen size={20} />
                    <span>Courses</span>
                </Link>
                <Link to="/my-courses" className="sidebar-item active">
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
            
            {user && logout && (
                <button className="sidebar-logout" onClick={logout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            )}
        </>
    );
};

export default MyCourses; 