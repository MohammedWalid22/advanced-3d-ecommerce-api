import 'dotenv/config' // 👈 السطر ده لازم يبقى أول واحد كدة عشان يحل المشكلة
import mongoose from 'mongoose'
import { app } from './app.js'

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// تشغيل السيرفر
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`)
})