const User      = require('../models/User')
const { signToken } = require('../middleware/auth')

const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id:   user._id,
      name:  user.name,
      email: user.email,
      phone: user.phone,
      role:  user.role,
    },
  })
}

// @desc  Register user
// @route POST /api/auth/register
// @access Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ success: false, message: 'Email already registered' })

    const user = await User.create({ name, email, phone, password })
    sendToken(user, 201, res)
  } catch (err) { next(err) }
}

// @desc  Login
// @route POST /api/auth/login
// @access Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required' })

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' })

    sendToken(user, 200, res)
  } catch (err) { next(err) }
}

// @desc  Get current user
// @route GET /api/auth/me
// @access Private
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user })
}

// @desc  Seed demo users (dev only)
// @route POST /api/auth/seed
// @access Public (dev)
exports.seed = async (req, res, next) => {
  try {
    await User.deleteMany({ email: { $in: ['user@swiftparcel.com','admin@swiftparcel.com'] } })
    await User.create([
      { name:'Demo User',  email:'user@swiftparcel.com',  phone:'9876543210', password:'password123', role:'user'  },
      { name:'Admin User', email:'admin@swiftparcel.com', phone:'9876543211', password:'password123', role:'admin' },
    ])
    res.json({ success: true, message: 'Demo users seeded: user@swiftparcel.com & admin@swiftparcel.com (password: password123)' })
  } catch (err) { next(err) }
}
