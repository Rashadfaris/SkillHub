import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PostProvider } from './context/PostContext';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import MyCourses from './components/MyCourses';
import Login from './pages/Login';
import './App.css';
import Home from './pages/Home/Home';
import { GoogleOAuthProvider } from '@react-oauth/google';

import LearningPlanForm from './pages/learningplan/LearningPlanForm';
import LearningPlanDetail from './pages/learningplan/LearningPlanDetail';
import LearningPlanList from './pages/learningplan/LearningPlanList';
import EditLearningPlanForm from './pages/learningplan/EditLearningPlanForm';

import ViewPostPage from './pages/Post/ViewPostPage';
import Feed from './pages/Post/Feed';
import PostForm from './pages/Post/CreatePostPage';

import Navbar from './components/Navbar/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';




// Create a wrapper component to handle the Navbar rendering
const AppContent = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    const handlePostSuccess = (post) => {
        console.log('Post submitted:', post);
    };

    return (
        <div className="app">
            {!isLoginPage && <Navbar />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/courses/:courseId" element={<CourseDetail />} />
                <Route path="/home" element={<Home />} />
                <Route path="/courses" element={<CourseList />} />

                <Route path="/plan/new" element={<LearningPlanForm />} />
                <Route path="/plans" element={<LearningPlanList />} />
                <Route path="/plan/edit/:id" element={<EditLearningPlanForm />} />
                <Route path="/plan/:id" element={<LearningPlanDetail />} />

                <Route path="/posts" element={<ViewPostPage />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/create" element={<PostForm onSuccess={handlePostSuccess} />} />

            </Routes>
        </div>
    );
};

function App() {
    return (
        <GoogleOAuthProvider clientId="235074436580-fekrpapo667arbo0jkqa9nmprcpqul96.apps.googleusercontent.com">
            <Router>
                <AuthProvider>
                    <PostProvider>
                        <AppContent />
                    </PostProvider>
                </AuthProvider>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
