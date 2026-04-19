const Parcel = require('../models/Parcel')
const Report = require('../models/Report')

// @desc  Get summary stats
// @route GET /api/reports/summary
// @access Private
exports.getSummary = async (req, res, next) => {
  try {
    const [total, delivered, inTransit, outForDelivery, pickedUp] = await Promise.all([
      Parcel.countDocuments(),
      Parcel.countDocuments({ status: 'Delivered' }),
      Parcel.countDocuments({ status: 'In Transit' }),
      Parcel.countDocuments({ status: 'Out for Delivery' }),
      Parcel.countDocuments({ status: 'Picked Up' }),
    ])
    const pending      = total - delivered
    const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) : 0

    res.json({ success:true, totalParcels:total, delivered, inTransit, outForDelivery, pickedUp, pending, deliveryRate })
  } catch (err) { next(err) }
}

// @desc  Get monthly stats for charts
// @route GET /api/reports/monthly
// @access Private
exports.getMonthly = async (req, res, next) => {
  try {
    const data = await Parcel.aggregate([
      {
        $group: {
          _id: { month: { $month:'$createdAt' }, year: { $year:'$createdAt' } },
          total:     { $sum: 1 },
          delivered: { $sum: { $cond: [{ $eq:['$status','Delivered'] }, 1, 0] } },
          pending:   { $sum: { $cond: [{ $ne: ['$status','Delivered'] }, 1, 0] } },
        },
      },
      { $sort: { '_id.year':1, '_id.month':1 } },
      { $limit: 12 },
    ])
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const monthly = data.map(d => ({
      month: MONTHS[d._id.month - 1],
      total: d.total, delivered: d.delivered, pending: d.pending,
    }))
    res.json({ success: true, monthly })
  } catch (err) { next(err) }
}

// @desc  Generate & save a report snapshot
// @route POST /api/reports/generate
// @access Private (admin)
exports.generateReport = async (req, res, next) => {
  try {
    const [total, delivered, inTransit, outForDelivery, pickedUp] = await Promise.all([
      Parcel.countDocuments(),
      Parcel.countDocuments({ status: 'Delivered' }),
      Parcel.countDocuments({ status: 'In Transit' }),
      Parcel.countDocuments({ status: 'Out for Delivery' }),
      Parcel.countDocuments({ status: 'Picked Up' }),
    ])
    const now = new Date()
    const report = await Report.create({
      totalParcels:     total,
      deliveredParcels: delivered,
      pendingParcels:   total - delivered,
      inTransit, outForDelivery, pickedUp,
      deliveryRate:  total > 0 ? Math.round((delivered/total)*100) : 0,
      generatedBy:   req.user._id,
      month:         now.toLocaleString('default', { month: 'long' }),
      year:          now.getFullYear(),
    })
    res.status(201).json({ success: true, report })
  } catch (err) { next(err) }
}

// @desc  List all reports
// @route GET /api/reports
// @access Private (admin)
exports.listReports = async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('generatedBy', 'name')
      .sort('-createdAt')
      .limit(20)
    res.json({ success: true, reports })
  } catch (err) { next(err) }
}
