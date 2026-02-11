import express from 'express'
import { createPaymentIntent, confirmPayment, sendStripeApiKey } from '../controllers/paymentController.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router.use(protect) 

router.post('/create-intent', createPaymentIntent) 
router.post('/confirm', confirmPayment)            
router.get('/stripeapi', sendStripeApiKey)         

export default router
