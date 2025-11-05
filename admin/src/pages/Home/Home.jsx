import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook

const Home = () => {
  const navigate = useNavigate();  // Initialize the navigate function

  const handleRedirect = () => {
    navigate('/learning-progress');  // Redirect to the LearningProgress page
  };

  return (
    <div>
      <h1>Welcome to the Learning Progress Tracker</h1>
      <p>This is a simple application to track your learning progress.</p>  

      <button onClick={handleRedirect}>
        Go to Learning Progress
      </button>
    </div>
  );
}

export default Home;
