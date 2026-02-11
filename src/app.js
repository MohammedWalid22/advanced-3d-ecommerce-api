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

// 1. إعدادات الأمان (Helmet) - حماية الـ Headers
app.use(helmet())

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: '10kb' })) // 🆕 منع إرسال بيانات ضخمة تهنج السيرفر
app.use(cookieParser())

// 2. تنظيف البيانات (Sanitization)
app.use(mongoSanitize()) // منع حقن NoSQL Injection
app.use(xss()) // منع أكواد HTML/JS الخبيثة

// 3. تحديد عدد الطلبات (Rate Limiting)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 طلب لكل IP
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

// معالجة الأخطاء (بدون كشف تفاصيل السيرفر في الـ Production)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack // 🆕 إخفاء المسارات
  })
})