import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, ListGroup, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';
import SharePlanModal from './SharePlanModal';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://localhost:9006/api';

const LearningPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!id || !user) {
        setError('Invalid plan ID or user not authenticated');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/plans/${id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response && response.data) {
          setPlan(response.data);
        } else {
          setError('No data received from server');
        }
      } catch (err) {
        console.error('Error fetching plan:', err);
        setError(`Failed to load learning plan: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  const handleEdit = () => {
    navigate(`/plan/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await axios.delete(`${API_URL}/plans/${id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        navigate('/');
      } catch (err) {
        setError(`Failed to delete learning plan: ${err.message || 'Unknown error'}`);
        console.error('Error deleting plan:', err);
      }
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleShareSubmit = async () => {
    if (!user || !user.id) {
      setError('User not authenticated');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/plans/${id}/share/${user.id}`, {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setPlan(response.data);
        setShowShareModal(false);
      }
    } catch (err) {
      setError(`Failed to share learning plan: ${err.response?.data?.message || err.message || 'Unknown error'}`);
      console.error('Error sharing plan:', err);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/')}>
              Return to Plans
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!plan) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          Learning plan not found
          <div className="mt-3">
            <Button variant="primary" onClick={() => navigate('/')}>
              Return to Plans
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>{plan.title || 'Untitled Plan'}</h2>
      <p>{plan.description || 'No description available'}</p>
      
      <div className="mb-3">
        <Button variant="primary" onClick={handleEdit} className="me-2">Edit</Button>
        <Button variant="danger" onClick={handleDelete} className="me-2">Delete</Button>
        <Button variant="info" onClick={handleShare}>Share</Button>
      </div>

      {plan.sharedWith && plan.sharedWith.length > 0 && (
        <Alert variant="info" className="mb-3">
          This plan is shared with {plan.sharedWith.length} user(s)
        </Alert>
      )}

      <h3>Topics</h3>
      {Array.isArray(plan.topics) && plan.topics.length > 0 ? (
        plan.topics.map((topic) => (
          <Card key={topic.id || `topic-${Math.random()}`} className="mb-3">
            <Card.Body>
              <Card.Title>{topic.name || 'Untitled Topic'}</Card.Title>
              <Card.Text>{topic.description || 'No description available'}</Card.Text>
              <div className="mb-2">
                <small>
                  Start: {topic.startDate || 'Not set'} | End: {topic.endDate || 'Not set'}
                </small>
              </div>
              <Badge bg={topic.completed ? 'success' : 'warning'}>
                {topic.completed ? 'Completed' : 'In Progress'}
              </Badge>
              
              <h5 className="mt-3">Resources</h5>
              {Array.isArray(topic.resources) && topic.resources.length > 0 ? (
                <ListGroup>
                  {topic.resources.map((resource) => (
                    <ListGroup.Item key={resource.id || `resource-${Math.random()}`}>
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {resource.name || 'Unnamed Resource'}
                      </a>
                      <Badge bg="secondary" className="ms-2">
                        {resource.type || 'Unknown'}
                      </Badge>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>No resources added yet</p>
              )}
            </Card.Body>
          </Card>
        ))
      ) : (
        <Alert variant="info">No topics added to this plan yet</Alert>
      )}

      <SharePlanModal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        onSubmit={handleShareSubmit}
      />
    </Container>
  );
};

export default LearningPlanDetail;