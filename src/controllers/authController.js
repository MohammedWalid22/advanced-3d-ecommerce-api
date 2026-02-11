import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { OAuth2Client } from 'google-auth-library'
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const generateToken = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

export const register = async (req, res) => {
  const { name, email, password } = req.body
  const user = await User.create({ name, email, password })
  res.status(201).json({ user, token: generateToken(user._id) })
}

export const login = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' })
  res.cookie('token', generateToken(user._id), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
  res.json({ user })
}

export const google = async (req, res) => {
  const { token } = req.body
  const ticket = await client.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID })
  const payload = ticket.getPayload()
  let user = await User.findOne({ email: payload.email })
  if (!user) user = await User.create({ name: payload.name, email: payload.email, password: '' })
  res.cookie('token', generateToken(user._id), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
  res.json({ user })
}

export const logout = (_, res) => {
  res.clearCookie('token')
  res.json({ message: 'Logged out' })
}