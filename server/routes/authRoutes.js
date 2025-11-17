import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import { generateToken, protect } from '../middleware/auth.js'

const router = express.Router()

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('emergencyContactName')
      .trim()
      .notEmpty()
      .withMessage('Emergency contact name is required'),
    body('emergencyContactPhone')
      .trim()
      .matches(/^\+?[0-9]{6,15}$/)
      .withMessage('Provide a valid phone number'),
    body('preferredLanguage')
      .optional()
      .isIn(['en', 'kn'])
      .withMessage('Invalid language selection'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const {
        name,
        email,
        password,
        emergencyContactName,
        emergencyContactPhone,
        preferredLanguage = 'en',
      } = req.body

      // Check if user already exists
      const userExists = await User.findOne({ email })
      if (userExists) {
        return res.status(400).json({
          message: 'User already exists with this email',
        })
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        emergencyContact: {
          name: emergencyContactName,
          phone: emergencyContactPhone,
        },
        preferredLanguage,
      })

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          emergencyContact: user.emergencyContact,
          token: generateToken(user._id),
          message: 'User registered successfully',
        })
      } else {
        res.status(400).json({
          message: 'Invalid user data',
        })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      })
    }
  }
)

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      // Check if user exists and get password
      const user = await User.findOne({ email }).select('+password')

      if (user && (await user.comparePassword(password))) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          preferredLanguage: user.preferredLanguage,
          emergencyContact: user.emergencyContact,
          token: generateToken(user._id),
          message: 'Login successful',
        })
      } else {
        res.status(401).json({
          message: 'Invalid email or password',
        })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      })
    }
  }
)

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
})

export default router

