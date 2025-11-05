import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CourseProvider } from './context/CourseContext';
import CourseList from './components/CourseList';

function App() {
  return (
    <CourseProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CourseList />} />

        </Routes>
      </Router>
    </CourseProvider>
  );
}

export default App;
