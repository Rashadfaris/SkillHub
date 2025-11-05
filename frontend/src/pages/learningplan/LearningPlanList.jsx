import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, Button, Row, Col, Badge, Alert, Spinner,
  Tooltip, OverlayTrigger, ListGroup
} from 'react-bootstrap';
import axios from 'axios';
import { FiPlus, FiTrash2, FiEye, FiShare2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import './LearningPlanList.css';

const API_URL = 'http://localhost:9006/api';

const LearningPlanList = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [sharedPlans, setSharedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeTab, setActiveTab] = useState('myPlans');

  useEffect(() => {
    const fetchPlans = async () => {
      if (!user) return;

      try {
        const [plansResponse, sharedPlansResponse] = await Promise.all([
          axios.get(`${API_URL}/plans/user/${user.id}`, { withCredentials: true }),
          axios.get(`${API_URL}/plans/shared/${user.id}`, { withCredentials: true })
        ]);
        setPlans(plansResponse.data);
        setSharedPlans(sharedPlansResponse.data);
      } catch (error) {
        setError('Failed to load learning plans');
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning plan?')) {
      try {
        await axios.delete(`${API_URL}/plans/${id}`, { withCredentials: true });
        setPlans(plans.filter(plan => plan.id !== id));
      } catch (error) {
        setError('Failed to delete learning plan');
        console.error('Error deleting plan:', error);
      }
    }
  };

  const renderPlanCard = (plan, isShared = false) => (
    <Col xs={12} sm={6} md={4} key={plan.id}>
      <div
        className={`glass-card enhanced-card${hoveredCard === plan.id ? ' hover' : ''}`}
        onMouseEnter={() => setHoveredCard(plan.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <div className="plan-card-image-container">
          <div className="plan-card-badge">
            {isShared ? 
              <div className="shared-badge"><FiShare2 size={14} /> Shared with you</div> : 
              <div className="owner-badge">Your Plan</div>
            }
          </div>
        </div>
        <Card.Body>
          <div className="d-flex align-items-center mb-2">
            <Card.Title className="flex-grow-1">{plan.title}</Card.Title>
          </div>
          <Card.Text className="plan-desc">{plan.description}</Card.Text>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Link to={`/plan/${plan.id}`} className="view-plan-btn">
              View Details <FiEye size={16} className="ms-1" />
            </Link>
            {!isShared && (
              <OverlayTrigger placement="top" overlay={<Tooltip>Delete Plan</Tooltip>}>
                <button
                  className="icon-btn delete"
                  aria-label="Delete"
                  onClick={() => handleDelete(plan.id)}
                >
                  <FiTrash2 size={18} />
                </button>
              </OverlayTrigger>
            )}
          </div>
        </Card.Body>
      </div>
    </Col>
  );

  const renderViewSharedCard = (plan) => (
    <Col xs={12} key={plan.id}>
      <Card className="mb-4 glass-card">
        <Card.Body>
          <Card.Title>{plan.title}</Card.Title>
          <Card.Text>{plan.description}</Card.Text>
          <h5 className="mt-3">Topics</h5>
          {Array.isArray(plan.topics) && plan.topics.length > 0 ? (
            plan.topics.map((topic) => (
              <Card key={topic.id || `topic-${Math.random()}`} className="mb-3">
                <Card.Body>
                  <Card.Title>{topic.name || 'Untitled Topic'}</Card.Title>
                  <Card.Text>{topic.description || 'No description available'}</Card.Text>
                  <div className="mb-2">
                    <ListGroup.Item>
                      {topic.name} - Start: {topic.startDate?.slice(0, 10) || 'Not set'} | End: {topic.endDate?.slice(0, 10) || 'Not set'}
                    </ListGroup.Item>
                  </div>
                  <Badge bg={topic.completed ? 'success' : 'warning'}>
                    {topic.completed ? 'Completed' : 'In Progress'}
                  </Badge>
                  <h6 className="mt-3">Resources</h6>
                  {Array.isArray(topic.resources) && topic.resources.length > 0 ? (
                    <ListGroup>
                      {topic.resources.map((resource) => (
                        <ListGroup.Item key={resource.id || `resource-${Math.random()}`}>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
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
        </Card.Body>
      </Card>
    </Col>
  );

  const renderTabs = () => (
    <div className="glass-tabs">
      <div className="tab-nav" style={{ display: "flex", borderBottom: "none" }}>
        <button className={`tab-nav-link${activeTab === "myPlans" ? " active" : ""}`} onClick={() => setActiveTab("myPlans")}>My Plans</button>
        <button className={`tab-nav-link${activeTab === "sharedPlans" ? " active" : ""}`} onClick={() => setActiveTab("sharedPlans")}>Shared With Me</button>
      </div>
      <div style={{ padding: "24px 0 0 0" }}>
        {activeTab === "myPlans" ? (
          <Row className="row-gap">
            {plans.length > 0 ? (
              plans.map(plan => renderPlanCard(plan))
            ) : (
              <Col>
                <Alert variant="info" className="glass-alert text-center">

                  <div>You don't have any learning plans yet.<br />Click <b>Create New Plan</b> to get started!</div>
                </Alert>
              </Col>
            )}
          </Row>
        ) : (
          <Row className="row-gap">
            {sharedPlans.length > 0 ? (
              sharedPlans.map(plan => renderViewSharedCard(plan))
            ) : (
              <Col>
                <Alert variant="info" className="glass-alert text-center">

                  <div>No shared plans available yet.</div>
                </Alert>
              </Col>
            )}
          </Row>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="body-bg">
        <div className="centered-content">
          <Spinner animation="border" variant="primary" />
          <div className="mt-3">Loading your learning plans...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="body-bg">
        <div className="lp-container">
          <Alert variant="danger" className="mt-5">{error}</Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed-layout course-detail-layout">
      <div className="scrollable-content">
        <div className="page-header">
          <div>
            <h2 className="fw-bold">📚 My Learning Plans</h2>
            <p className="text-muted">Organize your learning journey with custom plans</p>
          </div>
          <Link to="/plan/new">
            <Button variant="success" className="d-flex align-items-center">
              <FiPlus className="me-2" /> Create New Plan
            </Button>
          </Link>
        </div>
        {renderTabs()}
      </div>
    </div>
  );
};

export default LearningPlanList;