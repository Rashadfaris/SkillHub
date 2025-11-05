import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/courseManagement.css';

const CourseForm = ({ course, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        levels: []
    });

    useEffect(() => {
        if (course) {
            // Map levels and tasks to expected field names
            const mappedLevels = (course.levels || []).map(level => ({
                ...level,
                levelName: level.levelName || level.name || '',
                tasks: (level.tasks || []).map(task => ({
                    ...task,
                    taskName: task.taskName || task.name || '',
                    taskDescription: task.taskDescription || task.description || ''
                }))
            }));
            setFormData({
                ...course,
                levels: mappedLevels
            });
        }
    }, [course]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addLevel = () => {
        setFormData(prev => ({
            ...prev,
            levels: [
                ...prev.levels,
                {
                    levelNumber: prev.levels.length,
                    levelName: `Level ${prev.levels.length + 1}`,
                    tasks: []
                }
            ]
        }));
    };

    const removeLevel = (levelIndex) => {
        setFormData(prev => ({
            ...prev,
            levels: prev.levels.filter((_, index) => index !== levelIndex)
        }));
    };

    const updateLevelName = (levelIndex, levelName) => {
        setFormData(prev => ({
            ...prev,
            levels: prev.levels.map((level, index) => 
                index === levelIndex ? { ...level, levelName } : level
            )
        }));
    };

    const addTask = (levelIndex) => {
        setFormData(prev => ({
            ...prev,
            levels: prev.levels.map((level, index) => 
                index === levelIndex 
                    ? { 
                        ...level, 
                        tasks: [
                            ...level.tasks, 
                            { 
                                taskId: `task_${Date.now()}`,
                                taskName: `Task ${level.tasks.length + 1}`,
                                taskDescription: '',
                                isCompleted: false 
                            }
                        ] 
                    } 
                    : level
            )
        }));
    };

    const removeTask = (levelIndex, taskIndex) => {
        setFormData(prev => ({
            ...prev,
            levels: prev.levels.map((level, index) => 
                index === levelIndex 
                    ? { 
                        ...level, 
                        tasks: level.tasks.filter((_, idx) => idx !== taskIndex)
                    } 
                    : level
            )
        }));
    };

    const updateTask = (levelIndex, taskIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            levels: prev.levels.map((level, idx) => 
                idx === levelIndex 
                    ? { 
                        ...level, 
                        tasks: level.tasks.map((task, tidx) => 
                            tidx === taskIndex 
                                ? { ...task, [field]: value } 
                                : task
                        )
                    } 
                    : level
            )
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure proper data structure
            const courseData = {
                ...formData,
                levels: formData.levels.map((level, levelIndex) => ({
                    ...level,
                    levelNumber: levelIndex + 1,
                    tasks: level.tasks.map((task, taskIndex) => ({
                        ...task,
                        taskId: task.taskId || `task_${Date.now()}_${taskIndex}`,
                        isCompleted: task.isCompleted || false
                    }))
                }))
            };

            if (course) {
                await axios.put(`http://localhost:9006/api/courses/${course.id}`, courseData);
            } else {
                await axios.post('http://localhost:9006/api/courses', courseData);
            }
            onSave();
        } catch (error) {
            console.error('Error saving course:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="course-form">
            <div className="form-group">
                <label className="form-label">Course Name</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-textarea"
                    required
                />
            </div>

            <div className="levels-section">
                <div className="levels-header">
                    <h3>Levels</h3>
                    <button
                        type="button"
                        onClick={addLevel}
                        className="add-level-btn"
                    >
                        Add Level
                    </button>
                </div>

                {formData.levels.map((level, levelIndex) => (
                    <div key={levelIndex} className="level-card">
                        <div className="level-header">
                            <input
                                type="text"
                                value={level.levelName}
                                onChange={(e) => updateLevelName(levelIndex, e.target.value)}
                                className="level-name-input"
                                placeholder="Level Name"
                            />
                            <button
                                type="button"
                                onClick={() => removeLevel(levelIndex)}
                                className="remove-level-btn"
                            >
                                Remove Level
                            </button>
                        </div>

                        <div className="tasks-section">
                            <div className="tasks-header">
                                <h4>Tasks</h4>
                                <button
                                    type="button"
                                    onClick={() => addTask(levelIndex)}
                                    className="add-task-btn"
                                >
                                    Add Task
                                </button>
                            </div>

                            {level.tasks.map((task, taskIndex) => (
                                <div key={taskIndex} className="task-item">
                                    <input
                                        type="text"
                                        value={task.taskName}
                                        onChange={(e) => updateTask(levelIndex, taskIndex, 'taskName', e.target.value)}
                                        className="task-input"
                                        placeholder="Task Name"
                                    />
                                    <input
                                        type="text"
                                        value={task.taskDescription}
                                        onChange={(e) => updateTask(levelIndex, taskIndex, 'taskDescription', e.target.value)}
                                        className="task-input"
                                        placeholder="Task Description"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeTask(levelIndex, taskIndex)}
                                        className="remove-task-btn"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    onClick={onCancel}
                    className="cancel-btn"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="submit-btn"
                >
                    {course ? 'Update' : 'Create'} Course
                </button>
            </div>
        </form>
    );
};

export default CourseForm; 