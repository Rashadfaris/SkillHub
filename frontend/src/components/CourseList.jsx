import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { useAuth } from '../context/AuthContext';
import { Home, BookOpen, Calendar, User, Settings, LogOut, BookMarked, List, CheckSquare, MessageSquare } from 'lucide-react';
import ReactionBar from '../components/Reaction/ReactionBar';
import CommentSection from '../components/Comment/CommentSection';
import '../styles/CourseList.css';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [featuredCourse, setFeaturedCourse] = useState(null);
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
        fetchCourses();
        // Clear any cached course IDs
        localStorage.removeItem('lastViewedCourseIds');
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await courseService.getAllCourses();
            if (!data || data.length === 0) {
                setError('No courses available at the moment');
                setCourses([]);
            } else {
                setCourses(data);
                // Set featured course (for example, the first course)
                setFeaturedCourse(data[0]);
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Failed to load courses. Please try again later.');
            setCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await courseService.enrollInCourse(courseId, user.id);
            // Refresh the course list to show updated enrollment status
            fetchCourses();
        } catch (err) {
            console.error('Error enrolling in course:', err);
            setError('Failed to enroll in course. Please try again later.');
        }
    };

    if (loading) return (
        <div className="fixed-layout course-detail-layout">
            <div className="fixed-sidebar left-sidebar">
                <SidebarContent user={user} logout={logout} />
            </div>
            <div className="scrollable-content">
                <div className="loading">Loading courses...</div>
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
                        <button onClick={fetchCourses} className="retry-button">
                            Retry Loading Courses
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
                <div className="course-list-content">
                    <h1>Available Courses</h1>
                    
                    {/* Featured Course with Social Features */}
                    {featuredCourse && (
                        <div className="featured-course">
                            <h2>Featured Course</h2>
                            <div className="featured-card">
                                <div className="featured-image-container">
                                    <img
                                        src={getCourseImage(featuredCourse)}
                                        alt={featuredCourse.name}
                                        className="featured-image"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = courseImages.default;
                                        }}
                                    />
                                    <div className="featured-image-overlay">
                                        <span className="featured-badge">Featured</span>
                                    </div>
                                </div>
                                <div className="featured-content">
                                    <h3>{featuredCourse.name}</h3>
                                    <p>{featuredCourse.description}</p>
                                    <div className="featured-stats">
                                        <div className="stat">
                                            <span className="stat-label">Levels</span>
                                            <span className="stat-value">{featuredCourse.levels?.length || 0}</span>
                                        </div>
                                        <div className="stat">
                                            <span className="stat-label">Tasks</span>
                                            <span className="stat-value">
                                                {featuredCourse.levels?.reduce(
                                                    (total, level) => total + (level.tasks?.length || 0),
                                                    0
                                                ) || 0}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="featured-actions">
                                        <Link to={`/courses/${featuredCourse.id}`} className="view-btn featured-view">
                                            View Details
                                        </Link>
                                        <button 
                                            onClick={() => handleEnroll(featuredCourse.id)}
                                            className="enroll-btn featured-enroll"
                                            disabled={featuredCourse.enrolled}
                                        >
                                            {featuredCourse.enrolled ? 'Enrolled' : 'Enroll Now'}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Social Features for Featured Course */}
                                <div className="featured-social">
                                    <div className="reaction-container">
                                        <h4>What do you think about this course?</h4>
                                        <ReactionBar postId={featuredCourse.id} currentUser={user} />
                                    </div>
                                    
                                    <div className="comments-toggle">
                                        <button 
                                            className="comments-button"
                                            onClick={() => setShowComments(!showComments)}
                                        >
                                            <MessageSquare size={18} />
                                            {showComments ? 'Hide Comments' : 'Show Comments'}
                                        </button>
                                    </div>
                                    
                                    {showComments && (
                                        <div className="course-comments">
                                            <CommentSection postId={featuredCourse.id} currentUser={user} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <h2 className="more-courses-title">More Courses to Explore</h2>
                    {courses.length === 0 ? (
                        <div className="no-courses-message">
                            No courses are currently available. Please check back later.
                        </div>
                    ) : (
                        <div className="course-grid">
                            {courses.map((course) => (
                                // Skip the featured course in the regular grid
                                featuredCourse && course.id === featuredCourse.id ? null : (
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
                                        <div className="course-stats">
                                            <div className="stat">
                                                <span className="stat-label">Levels</span>
                                                <span className="stat-value">{course.levels?.length || 0}</span>
                                            </div>
                                            <div className="stat">
                                                <span className="stat-label">Tasks</span>
                                                <span className="stat-value">
                                                    {course.levels?.reduce(
                                                        (total, level) => total + (level.tasks?.length || 0),
                                                        0
                                                    ) || 0}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="course-actions">
                                            <Link to={`/courses/${course.id}`} className="view-btn">
                                                View Details
                                            </Link>
                                            <button 
                                                onClick={() => handleEnroll(course.id)}
                                                className="enroll-btn"
                                                disabled={course.enrolled}
                                            >
                                                {course.enrolled ? 'Enrolled' : 'Enroll Now'}
                                            </button>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Right Sidebar */}
            <div className="fixed-sidebar right-sidebar">
                <div className="sidebar-section">
                    <h3><BookMarked size={18} /> Course Categories</h3>
                    <div className="category-list">
                        <div className="category-item">
                            <span>All Courses</span>
                            <span className="count">{courses.length}</span>
                        </div>
                        <div className="category-item">
                            <span>Programming</span>
                            <span className="count">
                                {courses.filter(c => c.category === 'Programming').length || 0}
                            </span>
                        </div>
                        <div className="category-item">
                            <span>Design</span>
                            <span className="count">
                                {courses.filter(c => c.category === 'Design').length || 0}
                            </span>
                        </div>
                        <div className="category-item">
                            <span>Business</span>
                            <span className="count">
                                {courses.filter(c => c.category === 'Business').length || 0}
                            </span>
                        </div>
                    </div>
                </div>
                
                {user && (
                    <div className="sidebar-section">
                        <h3><CheckSquare size={18} /> Your Learning</h3>
                        <div className="learning-stats">
                            <button 
                                onClick={() => navigate('/my-courses')}
                                className="my-courses-btn"
                            >
                                View My Courses
                            </button>
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
            
            {user && logout && (
                <button className="sidebar-logout" onClick={logout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            )}
        </>
    );
};

export default CourseList; 