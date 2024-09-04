const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  model: String,
  serialNumber: String,
  purchaseDate: Date,
  maintenanceRecords: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceRecord' }]
});

module.exports = mongoose.model('Equipment', EquipmentSchema);