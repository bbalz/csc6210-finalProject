import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button, Navbar } from 'react-bootstrap';
import EquipmentModal from './components/EquipmentModal';
import AddEquipmentModal from './components/AddEquipmentModal';

function App() {
  const [equipment, setEquipment] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/equipment');
      setEquipment(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  const handleAddEquipment = async (newEquipment) => {
    try {
      const response = await axios.post('http://localhost:5001/api/equipment', newEquipment);
      setEquipment([...equipment, response.data]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding equipment:', error);
    }
  };

  const handleSelectEquipment = (item) => {
    setSelectedEquipment(item);
  };

  const handleCloseModal = () => {
    setSelectedEquipment(null);
  };

  const handleSaveEquipment = async (updatedEquipment) => {
    try {
      const response = await axios.put(`http://localhost:5001/api/equipment/${updatedEquipment._id}`, updatedEquipment);
      setEquipment(equipment.map(item => item._id === updatedEquipment._id ? response.data : item));
      setSelectedEquipment(response.data);
    } catch (error) {
      console.error('Error updating equipment:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const handleAddEntry = async (newEntry) => {
    try {
      const response = await axios.post(`http://localhost:5001/api/equipment/${selectedEquipment._id}/maintenance`, newEntry);
      const createdRecord = response.data;
      const updatedEquipment = {
        ...selectedEquipment,
        maintenanceRecords: [...selectedEquipment.maintenanceRecords, createdRecord]
      };
      setSelectedEquipment(updatedEquipment);
      setEquipment(equipment.map(item => item._id === selectedEquipment._id ? updatedEquipment : item));
    } catch (error) {
      console.error('Error adding maintenance record:', error);
    }
  };

  const handleUpdateEntry = async (entryId, updatedEntry) => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/equipment/${selectedEquipment._id}/maintenance/${entryId}`,
        updatedEntry
      );
      const updatedRecord = response.data;
      const updatedEquipment = {
        ...selectedEquipment,
        maintenanceRecords: selectedEquipment.maintenanceRecords.map(record => 
          record._id === entryId ? updatedRecord : record
        )
      };
      setSelectedEquipment(updatedEquipment);
      setEquipment(equipment.map(item => item._id === selectedEquipment._id ? updatedEquipment : item));
    } catch (error) {
      console.error('Error updating maintenance record:', error);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      await axios.delete(`http://localhost:5001/api/equipment/${selectedEquipment._id}/maintenance/${entryId}`);
      const updatedEquipment = {
        ...selectedEquipment,
        maintenanceRecords: selectedEquipment.maintenanceRecords.filter(record => record._id !== entryId)
      };
      setSelectedEquipment(updatedEquipment);
      setEquipment(equipment.map(item => item._id === selectedEquipment._id ? updatedEquipment : item));
    } catch (error) {
      console.error('Error deleting maintenance record:', error);
      console.error('Error response:', error.response?.data);
    }
  };

  const handleDeleteEquipment = async (equipmentId) => {
    try {
      await axios.delete(`http://localhost:5001/api/equipment/${equipmentId}`);
      setEquipment(equipment.filter(item => item._id !== equipmentId));
    } catch (error) {
      console.error('Error deleting equipment:', error);
    }
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">Equipment Maintenance App</Navbar.Brand>
          <Button variant="outline-light" onClick={() => setShowAddModal(true)}>Add New Equipment</Button>
        </Container>
      </Navbar>
      
      <Container>
        <h2 className="mb-4">Equipment List</h2>
        <Row xs={1} md={2} lg={3} className="g-4">
          {equipment.map((item) => (
            <Col key={item._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="mb-3">{item.name}</Card.Title>
                  <Card.Text>
                    <strong>Type:</strong> {item.type}<br />
                    <strong>Model:</strong> {item.model || 'N/A'}<br />
                    <strong>Serial Number:</strong> {item.serialNumber || 'N/A'}
                  </Card.Text>
                </Card.Body>
                <Card.Footer className="bg-white border-top-0">
                  <Button variant="primary" onClick={() => handleSelectEquipment(item)} className="me-2">View/Edit</Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteEquipment(item._id)}>Delete</Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {selectedEquipment && (
        <EquipmentModal
          equipment={selectedEquipment}
          onClose={handleCloseModal}
          onSave={handleSaveEquipment}
          onAddEntry={handleAddEntry}
          onUpdateEntry={handleUpdateEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      )}
      
      <AddEquipmentModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddEquipment}
      />
    </>
  );
}

export default App;