import Product from '../models/Product.js'

export const getProducts = async (req, res) => {
  const products = await Product.find()
  res.json(products)
}

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ message: 'Not found' })
  res.json(product)
}

export const createProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body
  const image = req.files?.image?.[0]?.path
  const model3D = req.files?.model3D?.[0]?.path
  const product = await Product.create({ name, description, price, category, stock, image, model3D })
  res.status(201).json(product)
}

export const updateProduct = async (req, res) => {
  const updates = { ...req.body }
  if (req.files?.image?.[0]) updates.image = req.files.image[0].path
  if (req.files?.model3D?.[0]) updates.model3D = req.files.model3D[0].path
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true })
  if (!product) return res.status(404).json({ message: 'Not found' })
  res.json(product)
}

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)
  if (!product) return res.status(404).json({ message: 'Not found' })
  res.json({ message: 'Deleted' })
}