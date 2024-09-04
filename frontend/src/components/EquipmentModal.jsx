import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';

const EquipmentModal = ({ equipment, onClose, onSave, onAddEntry, onUpdateEntry, onDeleteEntry }) => {
  const [editedEquipment, setEditedEquipment] = useState({ ...equipment });
  const [newEntry, setNewEntry] = useState({ date: '', startTime: '', endTime: '', notes: '' });
  const [editingEntryId, setEditingEntryId] = useState(null);

  useEffect(() => {
    setEditedEquipment({ ...equipment });
  }, [equipment]);

  const handleEquipmentChange = (e) => {
    setEditedEquipment({ ...editedEquipment, [e.target.name]: e.target.value });
  };

  const handleSaveEquipment = (e) => {
    e.preventDefault();
    onSave(editedEquipment);
  };

  const handleEntryChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
  };

  const handleAddEntry = (e) => {
    e.preventDefault();
    onAddEntry(newEntry);
    setNewEntry({ date: '', startTime: '', endTime: '', notes: '' });
  };

  const handleEditEntry = (entry) => {
    setEditingEntryId(entry._id);
    setNewEntry({
      date: entry.date.split('T')[0],
      startTime: entry.startTime,
      endTime: entry.endTime,
      notes: entry.notes || ''
    });
  };

  const handleUpdateEntry = (e) => {
    e.preventDefault();
    onUpdateEntry(editingEntryId, newEntry);
    setEditingEntryId(null);
    setNewEntry({ date: '', startTime: '', endTime: '', notes: '' });
  };

  return (
    <Modal show={true} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Equipment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSaveEquipment}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={editedEquipment.name}
              onChange={handleEquipmentChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Type</Form.Label>
            <Form.Select
              name="type"
              value={editedEquipment.type}
              onChange={handleEquipmentChange}
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
              value={editedEquipment.model}
              onChange={handleEquipmentChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Serial Number</Form.Label>
            <Form.Control
              type="text"
              name="serialNumber"
              value={editedEquipment.serialNumber}
              onChange={handleEquipmentChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Save Equipment
          </Button>
        </Form>

        <h3 className="mt-4">Maintenance/Usage Records</h3>
        <Form onSubmit={editingEntryId ? handleUpdateEntry : handleAddEntry} className="mb-3">
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={newEntry.date}
              onChange={handleEntryChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Start Time</Form.Label>
            <Form.Control
              type="time"
              name="startTime"
              value={newEntry.startTime}
              onChange={handleEntryChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>End Time</Form.Label>
            <Form.Control
              type="time"
              name="endTime"
              value={newEntry.endTime}
              onChange={handleEntryChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={newEntry.notes}
              onChange={handleEntryChange}
              placeholder="Enter maintenance notes here..."
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {editingEntryId ? 'Update Entry' : 'Add Entry'}
          </Button>
          {editingEntryId && (
            <Button variant="secondary" onClick={() => setEditingEntryId(null)} className="ms-2">
              Cancel Edit
            </Button>
          )}
        </Form>

        <ListGroup>
          {editedEquipment.maintenanceRecords.map((record) => (
            <ListGroup.Item key={record._id} className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <strong>{new Date(record.date).toLocaleDateString()}</strong>
                  <span className="ms-2">{record.startTime} to {record.endTime}</span>
                </div>
                <div>
                  <Button variant="outline-primary" size="sm" onClick={() => handleEditEntry(record)} className="me-2">
                    Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => onDeleteEntry(record._id)}>
                    Delete
                  </Button>
                </div>
              </div>
              {record.notes && <p className="mb-0 mt-2 text-muted">{record.notes}</p>}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EquipmentModal;