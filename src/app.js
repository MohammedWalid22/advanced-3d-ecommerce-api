import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import passport from 'passport'
import helmet from 'helmet' // 🆕
import xss from 'xss-clean' // 🆕
import mongoSanitize from 'express-mongo-sanitize' // 🆕
import rateLimit from 'express-rate-limit' // 🆕
import './config/passport.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import reviewRoutes from './routes/reviews.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/orders.js'
import paymentRoutes from './routes/payments.js'

export const app = express()

app.use(helmet())

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '10kb' })) 
app.use(cookieParser())
app.use(mongoSanitize()) 
app.use(xss()) 

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api', limiter)

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  })
})
