import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CourseForm from './CourseForm';
import '../styles/courseManagement.css';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:9006/api/courses');
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleEdit = (course) => {
        setSelectedCourse(course);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await axios.delete(`http://localhost:9006/api/courses/${id}`);
                fetchCourses();
            } catch (error) {
                console.error('Error deleting course:', error);
            }
        }
    };

    const handleSave = () => {
        setShowForm(false);
        setSelectedCourse(null);
        fetchCourses();
    };

    return (
        <div className="course-management-container">
            <div className="course-header">
                <h1 className="course-title">Course Management</h1>
                <button
                    onClick={() => {
                        setSelectedCourse(null);
                        setShowForm(true);
                    }}
                    className="add-course-btn"
                >
                    Add New Course
                </button>
            </div>

            {showForm && (
                <div className="course-form-container">
                    <CourseForm
                        course={selectedCourse}
                        onSave={handleSave}
                        onCancel={() => {
                            setShowForm(false);
                            setSelectedCourse(null);
                        }}
                    />
                </div>
            )}

            <div className="course-grid">
                {courses.map((course) => (
                    <div key={course.id} className="course-card">
                        <h2 className="course-card-title">{course.name}</h2>
                        <p className="course-card-description">{course.description}</p>
                        <div className="course-actions">
                            <button
                                onClick={() => handleEdit(course)}
                                className="edit-btn"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(course.id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseList; 