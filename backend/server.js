const express      = require('express')
const cors         = require('cors')
const morgan       = require('morgan')
const dotenv       = require('dotenv')
const connectDB    = require('./config/db')
const errorHandler = require('./middleware/error')

dotenv.config()
connectDB()

const app = express()

// ── Middleware ────────────────────────────────────────────────────────
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// ── Routes ────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'))
app.use('/api/parcels', require('./routes/parcels'))
app.use('/api/reports', require('./routes/reports'))

// ── Health check ──────────────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'SwiftParcel API running ✅', env: process.env.NODE_ENV })
)

// ── 404 ───────────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
)

// ── Global error handler ──────────────────────────────────────────────
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 SwiftParcel server running on http://localhost:${PORT}`)
  console.log(`📦 Environment: ${process.env.NODE_ENV}`)
  console.log(`🌱 Seed demo users: POST http://localhost:${PORT}/api/auth/seed`)
})
