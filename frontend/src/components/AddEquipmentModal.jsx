import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AddEquipmentModal = ({ show, onClose, onSave }) => {
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    type: '',
    model: '',
    serialNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEquipment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newEquipment);
    setNewEquipment({ name: '', type: '', model: '', serialNumber: '' });
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Equipment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Equipment Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newEquipment.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="type"
              value={newEquipment.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Spring/Summer">Spring/Summer</option>
              <option value="Winter">Winter</option>
              <option value="Year Round">Year Round</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Model</Form.Label>
            <Form.Control
              type="text"
              name="model"
              value={newEquipment.model}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Serial Number</Form.Label>
            <Form.Control
              type="text"
              name="serialNumber"
              value={newEquipment.serialNumber}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Equipment
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddEquipmentModal;