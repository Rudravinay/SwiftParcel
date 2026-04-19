const Parcel = require('../models/Parcel')

// @desc  Create parcel (Book)
// @route POST /api/parcels
// @access Private
exports.createParcel = async (req, res, next) => {
  try {
    const parcel = await Parcel.create({ ...req.body, user: req.user._id })
    // Add initial tracking update
    parcel.trackingUpdates.push({
      status:    'Picked Up',
      location:  req.body.senderCity || '',
      updatedBy: req.user.name,
    })
    parcel.statusHistory.push({ status:'Picked Up', timestamp: new Date(), location: req.body.senderCity })
    await parcel.save()
    res.status(201).json({ success: true, parcel })
  } catch (err) { next(err) }
}

// @desc  Get all parcels (admin) or user's parcels
// @route GET /api/parcels
// @access Private (admin)
exports.getAllParcels = async (req, res, next) => {
  try {
    const { status, status_ne, limit = 50, page = 1, sort = '-createdAt' } = req.query
    const filter = {}
    if (status)    filter.status = status
    if (status_ne) filter.status = { $ne: status_ne }

    const parcels = await Parcel.find(filter)
      .populate('user', 'name email phone')
      .sort(sort)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))

    const total = await Parcel.countDocuments(filter)
    res.json({ success: true, total, parcels })
  } catch (err) { next(err) }
}

// @desc  Get logged-in user's parcels
// @route GET /api/parcels/my
// @access Private
exports.getMyParcels = async (req, res, next) => {
  try {
    const { limit = 20, sort = '-createdAt' } = req.query
    const parcels = await Parcel.find({ user: req.user._id }).sort(sort).limit(Number(limit))
    res.json({ success: true, total: parcels.length, parcels })
  } catch (err) { next(err) }
}

// @desc  Get parcel by tracking ID (public)
// @route GET /api/parcels/track/:trackingId
// @access Public
exports.trackParcel = async (req, res, next) => {
  try {
    const parcel = await Parcel.findOne({ trackingId: req.params.trackingId })
      .populate('user', 'name email')
    if (!parcel)
      return res.status(404).json({ success: false, message: 'Parcel not found. Check the tracking ID.' })
    res.json({ success: true, parcel })
  } catch (err) { next(err) }
}

// @desc  Get parcel by ID
// @route GET /api/parcels/:id
// @access Private
exports.getParcel = async (req, res, next) => {
  try {
    const parcel = await Parcel.findById(req.params.id).populate('user', 'name email')
    if (!parcel) return res.status(404).json({ success: false, message: 'Parcel not found' })
    // Users can only view own parcels
    if (req.user.role !== 'admin' && parcel.user._id.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' })
    res.json({ success: true, parcel })
  } catch (err) { next(err) }
}

// @desc  Update parcel (admin)
// @route PUT /api/parcels/:id
// @access Private (admin)
exports.updateParcel = async (req, res, next) => {
  try {
    const parcel = await Parcel.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    })
    if (!parcel) return res.status(404).json({ success: false, message: 'Parcel not found' })
    res.json({ success: true, parcel })
  } catch (err) { next(err) }
}

// @desc  Update parcel status + add tracking update (admin)
// @route PATCH /api/parcels/:id/status
// @access Private (admin)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status, location, note } = req.body
    const parcel = await Parcel.findById(req.params.id)
    if (!parcel) return res.status(404).json({ success: false, message: 'Parcel not found' })

    parcel.status = status
    parcel.trackingUpdates.push({
      status,
      location: location || '',
      updatedBy: req.user.name,
      note: note || '',
    })
    // statusHistory is auto-pushed via pre-save hook
    await parcel.save()
    res.json({ success: true, parcel })
  } catch (err) { next(err) }
}

// @desc  Delete parcel (admin)
// @route DELETE /api/parcels/:id
// @access Private (admin)
exports.deleteParcel = async (req, res, next) => {
  try {
    const parcel = await Parcel.findByIdAndDelete(req.params.id)
    if (!parcel) return res.status(404).json({ success: false, message: 'Parcel not found' })
    res.json({ success: true, message: 'Parcel deleted successfully' })
  } catch (err) { next(err) }
}
