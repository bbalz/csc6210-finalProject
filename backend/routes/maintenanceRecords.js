const express = require('express');
const router = express.Router();
const { Equipment } = require('../models/Equipment');

// Get all maintenance records
router.get('/', async (req, res) => {
  try {
    const equipment = await Equipment.find({}, 'name maintenanceRecords');
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new maintenance record
router.post('/', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.body.equipment);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    
    const newRecord = {
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime
    };
    
    equipment.maintenanceRecords.push(newRecord);
    await equipment.save();
    
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get maintenance records for a specific equipment
router.get('/:equipmentId', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.equipmentId, 'name maintenanceRecords');
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }
    res.json(equipment.maintenanceRecords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;