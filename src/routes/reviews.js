import express from 'express'
import { getReviews, createReview, deleteReview } from '../controllers/reviewController.js'
import { protect } from '../middlewares/auth.js'

const router = express.Router({ mergeParams: true })

router.get('/', getReviews)
router.use(protect)
router.post('/', createReview)
router.delete('/:id', deleteReview)

export default router