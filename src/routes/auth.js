import express from 'express'
import passport from 'passport'
import { register, login, logout, google } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/google', google)

// passport route (optional)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  res.cookie('token', generateToken(req.user._id), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
  res.redirect(process.env.CLIENT_URL)
})

export default router