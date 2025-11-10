// -----------------------------
// Sanchara Backend - server.js
// -----------------------------

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'

// Import Routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import contactRoutes from './routes/contactRoutes.js'

// Load environment variables
dotenv.config()

// Determine demo mode (skip DB and APIs)
const isDemoMode = process.env.DEMO_MODE === 'true'

// Connect to MongoDB (skip in demo mode)
if (!isDemoMode) {
	connectDB()
} else {
	console.log('⚠️  DEMO_MODE enabled: Skipping MongoDB connection and API routes')
}

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// -----------------------------
// Middleware setup
// -----------------------------
app.use(cors()) // Allow cross-origin requests
app.use(express.json()) // Parse JSON data
app.use(express.urlencoded({ extended: true })) // Parse form data

// Serve static frontend files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../public')))

// -----------------------------
// API ROUTES
// -----------------------------
if (!isDemoMode) {
	app.use('/api/auth', authRoutes)
	app.use('/api/users', userRoutes)
	app.use('/api/contact', contactRoutes)
}

// Health check API endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: isDemoMode
			? '🟡 Running in DEMO_MODE (DB and APIs disabled).'
			: '✅ Sanchara API is running fine!',
  })
})

// -----------------------------
// FRONTEND PAGE ROUTES
// -----------------------------
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/about.html'))
})

app.get('/assistance', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/assistance.html'))
})

app.get('/chatbot', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/chatbot.html'))
})

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/contact.html'))
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'))
})

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'))
})

// -----------------------------
// ERROR HANDLING
// -----------------------------
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack)
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  })
})

// Handle 404 Not Found
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/404.html'))
})

// -----------------------------
// START SERVER
// -----------------------------
app.listen(PORT, () => {
  console.log('--------------------------------------')
  console.log(`🚀 Sanchara server running on port: ${PORT}`)
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📁 Serving frontend from: ${path.join(__dirname, '../public')}`)
  console.log('--------------------------------------')
})

// Export for testing (optional)
export default app
