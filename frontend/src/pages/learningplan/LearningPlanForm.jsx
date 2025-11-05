import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopicForm from './TopicForm';
import { FiPlus, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:9006/api';

const LearningPlanForm = ({ onCancel }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [plan, setPlan] = useState({
    title: '',
    description: '',
    topics: [],
    userId: user?.id,
    sharedWith: []
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a learning plan');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/plans`, plan, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      navigate('/', { state: { successMessage: 'Learning plan created successfully!' } });
    } catch (err) {
      setError('Failed to save learning plan. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTopic = () => {
    setPlan(prev => ({
      ...prev,
      topics: [...prev.topics, {
        id: Date.now().toString(),
        name: '',
        description: '',
        startDate: null,
        endDate: null,
        completed: false,
        resources: []
      }]
    }));
  };

  const handleTopicChange = (updatedTopic, index) => {
    setPlan(prev => {
      const newTopics = [...prev.topics];
      newTopics[index] = updatedTopic;
      return { ...prev, topics: newTopics };
    });
  };

  const handleRemoveTopic = (index) => {
    setPlan(prev => {
      const newTopics = [...prev.topics];
      newTopics.splice(index, 1);
      return { ...prev, topics: newTopics };
    });
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      padding: '2rem 0'
    }}>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div style={{
          backdropFilter: 'blur(16px) saturate(180%)',
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '2.5rem',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
          width: '100%',
          maxWidth: '800px',
          transition: 'all 0.3s ease'
        }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 style={{
              color: '#4a4a4a',
              fontWeight: '600',
              margin: 0
            }}>
              Create New Learning Plan
            </h2>
            <Button 
              variant="link" 
              onClick={handleCancel}
              style={{ color: '#6c757d' }}
            >
              <FiX size={24} />
            </Button>
          </div>

          {error && (
            <Alert variant="danger" className="fade-in mb-4">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '500', color: '#4a4a4a' }}>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={plan.title}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
                placeholder="Enter your learning plan title"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: '500', color: '#4a4a4a' }}>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={plan.description}
                onChange={handleChange}
                rows={4}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
                placeholder="Describe your learning goals and objectives"
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 style={{ fontWeight: '600', color: '#4a4a4a' }}>Topics</h3>
              <Button 
                variant="outline-primary" 
                onClick={handleAddTopic}
                style={{
                  borderRadius: '8px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FiPlus /> Add Topic
              </Button>
            </div>

            {plan.topics.length === 0 ? (
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                border: '2px dashed rgba(0, 0, 0, 0.1)',
                marginBottom: '1.5rem'
              }}>
                <p style={{ color: '#6c757d', margin: 0 }}>
                  No topics added yet. Click "Add Topic" to get started.
                </p>
              </div>
            ) : (
              plan.topics.map((topic, index) => (
                <Card key={topic.id} className="mb-3" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}>
                  <Card.Body>
                    <TopicForm
                      topic={topic}
                      onChange={(updatedTopic) => handleTopicChange(updatedTopic, index)}
                      onRemove={() => handleRemoveTopic(index)}
                    />
                  </Card.Body>
                </Card>
              ))
            )}

            <div className="d-flex justify-content-end gap-3 mt-4">
              <Button 
                variant="outline-secondary" 
                onClick={handleCancel}
                style={{
                  borderRadius: '8px',
                  padding: '10px 24px'
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSubmitting}
                style={{
                  borderRadius: '8px',
                  padding: '10px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <FiSave /> Create Plan
                  </>
                )}
              </Button>
            </div>
          </Form>
        </div>
      </Container>
      <style>
        {`
          .fade-in {
            animation: fadeIn 0.3s ease-in;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          body {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          }
        `}
      </style>
    </div>
  );
};

export default LearningPlanForm;
