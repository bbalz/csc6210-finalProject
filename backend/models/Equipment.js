const mongoose = require('mongoose');

const MaintenanceRecordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  notes: { type: String, default: '' } 
});

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  model: String,
  serialNumber: String,
  maintenanceRecords: [MaintenanceRecordSchema]
});

const Equipment = mongoose.model('Equipment', EquipmentSchema);

module.exports = { Equipment, MaintenanceRecordSchema };