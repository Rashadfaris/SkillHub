import React, { useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

const SharePlanModal = ({ show, onHide, onSubmit }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setError(''); // Clear any previous errors
      await onSubmit();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onHide();
      }, 2000);
    } catch (err) {
      console.error('Failed to share plan:', err);
      setError('Failed to share plan. Please try again.');
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Share Learning Plan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {success ? (
          <Alert variant="success">
            Plan shared successfully! You can view it in the "Shared with Me" tab.
          </Alert>
        ) : (
          <div>
            <p>Are you sure you want to share this learning plan?</p>
            <Button variant="primary" onClick={handleSubmit}>
              Share Plan
            </Button>
            <Button variant="outline-secondary" className="ms-2" onClick={onHide}>
              Cancel
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SharePlanModal;