import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const ResourceForm = ({ resource, onChange, onRemove }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...resource, [name]: value });
  };

  return (
    <Row className="mb-3 align-items-end">
      <Col xs={4}>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={resource.name}
            onChange={handleChange}
            required
          />
        </Form.Group>
      </Col>
      <Col xs={4}>
        <Form.Group>
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="url"
            name="url"
            value={resource.url}
            onChange={handleChange}
          />
        </Form.Group>
      </Col>
      <Col xs={3}>
        <Form.Group>
          <Form.Label>Type</Form.Label>
          <Form.Select name="type" value={resource.type} onChange={handleChange}>
            <option value="BOOK">Book</option>
            <option value="VIDEO">Video</option>
            <option value="ARTICLE">Article</option>
            <option value="COURSE">Course</option>
            <option value="OTHER">Other</option>
          </Form.Select>
        </Form.Group>
      </Col>
      <Col xs={1}>
        <Button variant="outline-danger" size="sm" onClick={onRemove}>
          Remove
        </Button>
      </Col>
    </Row>
  );
};

export default ResourceForm;
