// src/components/EditLearningPlanForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import TopicForm from './TopicForm';

const API_URL = 'http://localhost:9006/api';

const EditLearningPlanForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await axios.get(`${API_URL}/plans/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
        setPlan(response.data);
      } catch (err) {
        setError('Failed to load learning plan');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlan();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPlan(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/plans/${plan.id}`, plan, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      navigate('/');
    } catch (err) {
      setError('Failed to update learning plan');
      console.error(err);
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

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!plan) {
    return <Alert variant="warning">Learning plan not found</Alert>;
  }

  return (
    <Container className="mt-4">
      <h2>Edit Learning Plan</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={plan.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={plan.description}
            onChange={handleChange}
            rows={3}
          />
        </Form.Group>
        
        <h3 className="mt-4">Topics</h3>
        {plan.topics.map((topic, index) => (
          <Card key={topic.id} className="mb-3">
            <Card.Body>
              <TopicForm
                topic={topic}
                onChange={(updatedTopic) => handleTopicChange(updatedTopic, index)}
                onRemove={() => handleRemoveTopic(index)}
              />
            </Card.Body>
          </Card>
        ))}
        <Button variant="secondary" onClick={handleAddTopic} className="mb-3">
          Add Topic
        </Button>
        
        <div className="d-flex justify-content-between">
          <Button variant="primary" type="submit">
            Update Plan
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate('/')}>
            Cancel
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EditLearningPlanForm;