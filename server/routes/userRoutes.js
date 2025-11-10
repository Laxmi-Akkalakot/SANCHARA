import express from 'express'
import { protect } from '../middleware/auth.js'
import User from '../models/User.js'

const router = express.Router()

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    })
  }
})

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email } = req.body

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (name) user.name = name
    if (email) {
      // Check if email is already taken
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } })
      if (emailExists) {
        return res.status(400).json({
          message: 'Email already in use',
        })
      }
      user.email = email
    }

    await user.save()

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      message: 'Profile updated successfully',
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

