import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home as HomeIcon, BookOpen, Calendar, Bell, User, Settings, Plus, Trophy, TrendingUp, Clock } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import Feed from "../Post/Feed";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    streak: 5,
    coursesInProgress: 2,
    totalLearningTime: 24
  });
  
  const handleNewPost = () => {
    navigate('/create');
  };

  return (
    <div className="fixed-layout home-layout">
      {/* Left Sidebar */}
      <div className="fixed-sidebar left-sidebar">
        
        <div className="sidebar-nav">
          <Link to="/" className="sidebar-item active">
            <HomeIcon size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/courses" className="sidebar-item">
            <BookOpen size={20} />
            <span>Courses</span>
          </Link>
          <Link to="/posts" className="sidebar-item">
            <Plus size={20} />
            <span>My Posts</span>
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
      </div>

      {/* Main Content */}
      <div className="scrollable-content main-content-section">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <div className="welcome-content">
            <h1>Welcome back, {user?.name || 'Learner'}!</h1>
            <p>Continue your learning journey today</p>
            <div className="welcome-actions">
              <Link to="/courses" className="welcome-btn primary">
                Explore Courses
              </Link>
              <Link to="/my-courses" className="welcome-btn secondary">
                Resume Learning
              </Link>
            </div>
          </div>
          <div className="welcome-image">
            <img 
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
              alt="Welcome" 
            />
          </div>
        </div>
        
        {/* Learning Stats */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon">
              <Trophy size={24} />
            </div>
            <div className="stat-details">
              <h3>{stats.streak} days</h3>
              <p>Learning Streak</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="stat-details">
              <h3>{stats.coursesInProgress}</h3>
              <p>Courses in Progress</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-details">
              <h3>{stats.totalLearningTime}h</h3>
              <p>Total Learning Time</p>
            </div>
          </div>
        </div>
        
        <Feed onNewPost={handleNewPost} />
      </div>

      {/* Right Sidebar */}
      <div className="fixed-sidebar right-sidebar">
       <div className="sidebar-section">
          <h3><Bell size={18} /> Notifications</h3>
          <ul className="notification-list">
            <li className="notification-item">
              <span className="notification-dot new"></span>
              <p>New course recommendations</p>
            </li>
            <li className="notification-item">
              <span className="notification-dot"></span>
              <p>Weekly learning digest</p>
            </li>
          </ul>
        </div>
        
        <div className="sidebar-section">
          <h3>Quick Links</h3>
          <div className="quick-links">
            <div className="quick-link-banner">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="Start learning now" 
                className="quick-link-image"
              />
              <div className="quick-link-overlay">
                <span>Start Learning Today</span>
              </div>
            </div>
            <div className="quick-link-list">
              <Link to="/courses" className="quick-link-item">
                <div className="quick-link-icon">🎓</div>
                <div className="quick-link-text">Browse Courses</div>
              </Link>
              <Link to="/my-courses" className="quick-link-item">
                <div className="quick-link-icon">📚</div>
                <div className="quick-link-text">My Learning</div>
              </Link>
              <Link to="/posts" className="quick-link-item">
                <div className="quick-link-icon">📝</div>
                <div className="quick-link-text">Latest Posts</div>
              </Link>
              <Link to="/plans" className="quick-link-item">
                <div className="quick-link-icon">📅</div>
                <div className="quick-link-text">Learning Plans</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
