const mongoose = require('mongoose')

// ── Tracking Update sub-document (ER: Tracking Update entity) ─────────
const TrackingUpdateSchema = new mongoose.Schema({
  status:    { type: String, enum: ['Picked Up','In Transit','Out for Delivery','Delivered'], required: true },
  location:  { type: String, default: '' },
  updatedBy: { type: String, default: '' },
  note:      { type: String, default: '' },
}, { timestamps: true })

// ── Parcel model (ER: Parcel entity) ─────────────────────────────────
const ParcelSchema = new mongoose.Schema({
  // Auto-generated tracking ID
  trackingId: {
    type: String, unique: true,
    default: () => `SP-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*900+100)}`,
  },

  // Customer / Sender (ER: Customer entity)
  user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName:     { type: String, required: true },
  senderPhone:    { type: String, required: true },
  senderEmail:    { type: String, required: true },
  senderAddress:  { type: String, required: true },
  senderCity:     { type: String, required: true },

  // Receiver (ER: Receiver fields on Parcel)
  receiverName:    { type: String, required: true },
  receiverPhone:   { type: String, required: true },
  receiverAddress: { type: String, required: true },
  receiverCity:    { type: String, required: true },

  // Parcel info (ER: Parcel attributes)
  parcelType:           { type: String, required: true },
  weight:               { type: Number, required: true },
  contents:             { type: String, required: true },
  specialInstructions:  { type: String, default: '' },

  // Status lifecycle (ER: Parcel status)
  status: {
    type: String,
    enum: ['Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'],
    default: 'Picked Up',
  },

  // Admin assigned (ER: Admin manages Parcel)
  assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

  // Tracking updates history (ER: TrackingUpdate entity)
  trackingUpdates: [TrackingUpdateSchema],

  // Status history array (ER: ShipmentHistory entity)
  statusHistory: [{
    status:    String,
    timestamp: { type: Date, default: Date.now },
    location:  String,
  }],

  estimatedDelivery: { type: Date, default: () => new Date(Date.now() + 3*24*60*60*1000) },
  deliveredAt:       { type: Date },
}, { timestamps: true })

// Auto-push to statusHistory on status change
ParcelSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.statusHistory.push({ status: this.status, timestamp: new Date() })
    if (this.status === 'Delivered') this.deliveredAt = new Date()
  }
  next()
})

module.exports = mongoose.model('Parcel', ParcelSchema)
