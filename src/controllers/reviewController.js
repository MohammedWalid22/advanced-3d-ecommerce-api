import Review from '../models/Review.js'

export const getReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name')
  res.json(reviews)
}

export const createReview = async (req, res) => {
  const { rating, comment } = req.body
  const review = await Review.create({ product: req.params.productId, user: req.user._id, rating, comment })
  res.status(201).json(review)
}

export const deleteReview = async (req, res) => {
  await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id })
  res.json({ message: 'Review deleted' })
}