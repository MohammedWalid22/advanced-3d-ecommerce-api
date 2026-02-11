import express from 'express'
import { createPaymentIntent, confirmPayment, sendStripeApiKey } from '../controllers/paymentController.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router.use(protect) // حماية: لازم تسجيل دخول

router.post('/create-intent', createPaymentIntent) // إنشاء عملية دفع
router.post('/confirm', confirmPayment)            // تأكيد العملية وتحديث الطلب
router.get('/stripeapi', sendStripeApiKey)         // إرسال المفتاح للفرونت

export default router