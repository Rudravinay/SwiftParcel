const express = require('express')
const router  = express.Router()
const { getSummary, getMonthly, generateReport, listReports } = require('../controllers/reportController')
const { protect, adminOnly } = require('../middleware/auth')

router.use(protect)
router.get('/summary',  getSummary)
router.get('/monthly',  getMonthly)
router.get('/',         adminOnly, listReports)
router.post('/generate',adminOnly, generateReport)

module.exports = router
