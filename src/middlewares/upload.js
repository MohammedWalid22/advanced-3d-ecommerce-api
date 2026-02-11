import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../config/cloudinary.js'

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: file.fieldname === 'model3D' ? 'models3d' : 'products',
    resource_type: file.fieldname === 'model3D' ? 'raw' : 'image'
  })
})

export default multer({ storage })