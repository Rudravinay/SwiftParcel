const express = require('express')
const router  = express.Router()
const {
  createParcel, getAllParcels, getMyParcels,
  trackParcel, getParcel, updateParcel,
  updateStatus, deleteParcel,
} = require('../controllers/parcelController')
const { protect, adminOnly } = require('../middleware/auth')

// Public
router.get('/track/:trackingId', trackParcel)

// Protected — user
router.use(protect)
router.post('/',     createParcel)
router.get('/my',    getMyParcels)
router.get('/:id',   getParcel)

// Admin only
router.get   ('/',        adminOnly, getAllParcels)
router.put   ('/:id',     adminOnly, updateParcel)
router.patch ('/:id/status', adminOnly, updateStatus)
router.delete('/:id',     adminOnly, deleteParcel)

module.exports = router
