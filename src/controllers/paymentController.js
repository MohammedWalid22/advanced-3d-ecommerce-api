import Stripe from 'stripe'
import Order from '../models/Order.js'
import dotenv from 'dotenv'

dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


export const createPaymentIntent = async (req, res) => {
  try {
    
    const { orderId } = req.body
    
    
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' })
    }

    const order = await Order.findById(orderId)
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

   
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized: You can only pay for your own orders' })
    }

    
    if (order.status === 'completed') {
      return res.status(400).json({ message: 'Order is already paid' })
    }

    const amount = order.totalAmount

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, 
      currency: 'usd',
      metadata: { orderId: order._id.toString() }
    })

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id 
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (intent.status === 'succeeded') {
      await Order.findByIdAndUpdate(orderId, { 
        status: 'completed', 
        paymentId: paymentIntentId,
        paymentMethod: 'Card' 
      })
      res.json({ message: 'Payment confirmed' })
    } else {
      res.status(400).json({ message: 'Payment failed' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const sendStripeApiKey = async (req, res) => {
  res.json({ stripeApiKey: process.env.STRIPE_PUBLISHABLE_KEY })
}
