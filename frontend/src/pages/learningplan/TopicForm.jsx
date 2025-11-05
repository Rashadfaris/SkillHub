import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import ResourceForm from './ResourceForm';

const TopicForm = ({ topic, onChange, onRemove }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange({
      ...topic,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAddResource = () => {
    onChange({
      ...topic,
      resources: [
        ...topic.resources,
        { id: Date.now().toString(), name: '', url: '', type: 'OTHER' }
      ]
    });
  };

  const handleResourceChange = (updatedResource, index) => {
    const newResources = [...topic.resources];
    newResources[index] = updatedResource;
    onChange({ ...topic, resources: newResources });
  };

  const handleRemoveResource = (index) => {
    const newResources = [...topic.resources];
    newResources.splice(index, 1);
    onChange({ ...topic, resources: newResources });
  };

  return (
    <div>
      <Form.Group className="mb-3">
        <Form.Label>Topic Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={topic.name}
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={topic.description}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <Row className="mb-3">
        <Col>
          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={topic.startDate || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={topic.endDate || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label="Completed"
          name="completed"
          checked={topic.completed}
          onChange={handleChange}
        />
      </Form.Group>

      <h5 className="mt-3">Resources</h5>
      {topic.resources.map((resource, index) => (
        <ResourceForm
          key={resource.id}
          resource={resource}
          onChange={(updatedResource) => handleResourceChange(updatedResource, index)}
          onRemove={() => handleRemoveResource(index)}
        />
      ))}
      <Button variant="outline-primary" size="sm" onClick={handleAddResource} className="mb-3">
        Add Resource
      </Button>

      <div className="d-flex justify-content-end">
        <Button variant="outline-danger" size="sm" onClick={onRemove}>
          Remove Topic
        </Button>
      </div>
    </div>
  );
};

export default TopicForm;
