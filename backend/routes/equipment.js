const express = require('express');
const router = express.Router();
const { Equipment } = require('../models/Equipment');

// GET all equipment
router.get('/', async (req, res) => {
  try {
    const equipment = await Equipment.find();
    console.log('Fetched equipment:', equipment);
    res.json(equipment);
  } catch (err) {
    console.error('Error fetching equipment:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET single equipment by ID
router.get('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new equipment
router.post('/', async (req, res) => {
  const equipment = new Equipment(req.body);
  try {
    const newEquipment = await equipment.save();
    console.log('New equipment added:', newEquipment);
    res.status(201).json(newEquipment);
  } catch (err) {
    console.error('Error adding equipment:', err);
    res.status(400).json({ message: err.message });
  }
});

// PATCH (update) equipment
router.patch('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }    Object.assign(equipment, req.body);
    const updatedEquipment = await equipment.save();
    res.json(updatedEquipment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete equipment
router.delete('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add new maintenance record
router.post('/:id/maintenance', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    const newRecord = {
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      notes: req.body.notes
    };
    
    equipment.maintenanceRecords.push(newRecord);
    await equipment.save();
    
    // Return the newly created record with its _id
    const createdRecord = equipment.maintenanceRecords[equipment.maintenanceRecords.length - 1];
    res.status(201).json(createdRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a maintenance record
router.put('/:equipmentId/maintenance/:maintenanceId', async (req, res) => {
  try {
    const { equipmentId, maintenanceId } = req.params;
    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    const maintenanceRecord = equipment.maintenanceRecords.id(maintenanceId);

    if (!maintenanceRecord) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    maintenanceRecord.date = req.body.date;
    maintenanceRecord.startTime = req.body.startTime;
    maintenanceRecord.endTime = req.body.endTime;
    maintenanceRecord.notes = req.body.notes;

    await equipment.save();

    res.json(maintenanceRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a maintenance record
router.delete('/:equipmentId/maintenance/:maintenanceId', async (req, res) => {
  try {
    const { equipmentId, maintenanceId } = req.params;
    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    const maintenanceRecordIndex = equipment.maintenanceRecords.findIndex(
      record => record._id.toString() === maintenanceId
    );

    if (maintenanceRecordIndex === -1) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    equipment.maintenanceRecords.splice(maintenanceRecordIndex, 1);
    await equipment.save();

    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting maintenance record:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update equipment
router.put('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(equipment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
