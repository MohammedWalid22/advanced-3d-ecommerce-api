import express from 'express'
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js'
import upload from '../middlewares/upload.js'
import { protect } from '../middlewares/auth.js'
import { adminOnly } from '../middlewares/admin.js'
import reviewRouter from './reviews.js' // 👈 1. استيراد ملف الريفيوهات

const router = express.Router()

// 👈 2. أي طلب يروح للينك ده، حوله فوراً لملف reviews.js
router.use('/:productId/reviews', reviewRouter)

router.get('/', getProducts)
router.get('/:id', getProductById)

// حماية الراوتس اللي جاية (للأدمن فقط)
router.use(protect, adminOnly)

router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'model3D', maxCount: 1 }]), createProduct)
router.patch('/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'model3D', maxCount: 1 }]), updateProduct)
router.delete('/:id', deleteProduct)

export default router