import express from 'express'
import { createOrder, getMyOrders } from '../controllers/orderController.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router()

router.use(protect)
router.post('/', createOrder)
router.get('/', getMyOrders)

export default router