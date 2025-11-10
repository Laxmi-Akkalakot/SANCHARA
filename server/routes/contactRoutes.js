import express from 'express'
import { body, validationResult } from 'express-validator'
import Contact from '../models/Contact.js'

const router = express.Router()

// @route   POST /api/contact
// @desc    Send contact message
// @access  Public
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, message } = req.body

      const contact = await Contact.create({
        name,
        email,
        message,
      })

      res.status(201).json({
        message: 'Contact message sent successfully',
        contact: {
          _id: contact._id,
          name: contact.name,
          email: contact.email,
          message: contact.message,
        },
      })
    } catch (error) {
      console.error(error)
      res.status(500).json({
        message: 'Server error',
        error: error.message,
      })
    }
  }
)

// @route   GET /api/contact
// @desc    Get all contact messages (for admin)
// @access  Private (should add admin check in production)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json({
      contacts,
      count: contacts.length,
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

