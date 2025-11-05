import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const data = isLogin ? { email, password } : { email, password, name };
            
            const response = await axios.post(`http://localhost:9006${endpoint}`, data, {
                withCredentials: true
            });

            if (response.data.success) {
                login(response.data.user);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post('http://localhost:9006/api/auth/google', {
                credential: credentialResponse.credential
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                login(response.data.user);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error('Google login error:', err);
            setError(err.response?.data?.message || 'Google login failed. Please try again.');
        }
    };

    const handleGoogleError = () => {
        console.error('Google login failed');
        setError('Google login failed. Please try again.');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1>Welcome to SkillHub</h1>
                <p>{isLogin ? 'Sign in to continue' : 'Create an account'}</p>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="login-form">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="login-btn">
                        {isLogin ? 'Sign In' : 'Register'}
                    </button>
                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <div className="google-login">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap={false}
                        theme="filled_blue"
                        shape="rectangular"
                        text="continue_with"
                        locale="en"
                        flow="implicit"
                        context="signin"
                    />
                </div>
                
                <button 
                    className="toggle-auth-btn"
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? 'Need an account? Register' : 'Already have an account? Sign in'}
                </button>
            </div>
        </div>
    );
};

export default Login; 