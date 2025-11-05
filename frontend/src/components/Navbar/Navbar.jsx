// src/components/Navbar.js
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                
                {/* Logo - Left */}
                <div className="navbar-section navbar-start">
                    <Link to="/" className="navbar-logo">
                        <span className="logo-icon">📘</span> {/* Optional: replace with SVG or icon */}
                        <span className="logo-text">SkillHub</span>
                    </Link>
                </div>

                {/* Links - Center */}
                <div className="navbar-section navbar-center">
                    <Link to="/my-courses" className="nav-link">
                        My Courses
                    </Link>
                    <Link to="/plans" className="nav-link">
                        Plans
                    </Link>
                    <Link to="/posts" className="nav-link">
                        My Posts
                    </Link>
                </div>

                {/* Profile/Login - Right */}
                <div className="navbar-section navbar-end" ref={dropdownRef}>
                    {user ? (
                        <div className="navbar-profile">
                            <button 
                                className="profile-button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <div className="profile-avatar">
                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span className="profile-name">{user.name || 'User'}</span>
                            </button>

                            {isDropdownOpen && (
                                <div className="profile-dropdown">
                                    <Link to="/profile" className="dropdown-item">
                                        View Profile
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item">
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="login-button">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
