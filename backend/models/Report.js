const mongoose = require('mongoose')

const ReportSchema = new mongoose.Schema({
  // ER: Report entity fields
  totalParcels:    { type: Number, default: 0 },
  deliveredParcels:{ type: Number, default: 0 },
  pendingParcels:  { type: Number, default: 0 },
  inTransit:       { type: Number, default: 0 },
  outForDelivery:  { type: Number, default: 0 },
  pickedUp:        { type: Number, default: 0 },
  deliveryRate:    { type: Number, default: 0 },
  generatedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  generatedAt:     { type: Date, default: Date.now },
  month:           { type: String },
  year:            { type: Number },
}, { timestamps: true })

module.exports = mongoose.model('Report', ReportSchema)
