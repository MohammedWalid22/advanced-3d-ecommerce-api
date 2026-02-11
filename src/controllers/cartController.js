import Product from '../models/Product.js'; // 1. لازم نستورد الموديل عشان نقرأ المخزون

export const getCart = (req, res) => {
  const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
  res.json(cart);
}

// 2. حولنا الدالة لـ async عشان نقدر نكلم الداتابيز
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // هات تفاصيل المنتج من الداتابيز عشان نعرف المخزون كام
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

    // هات السلة الحالية
    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    
    // شوف هل المنتج موجود قبل كدة في السلة؟
    const existingItem = cart.find(i => i.productId === productId);
    
    // احسب الكمية الإجمالية اللي العميل عايزها (الجديد + القديم اللي في السلة)
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const totalRequested = currentQtyInCart + Number(quantity);

    // 🛑 اللحظة الحاسمة: مقارنة المطلوب بالمتاح
    if (totalRequested > product.stock) {
      return res.status(400).json({ 
        message: `عفواً، الكمية غير متاحة. المتاح: ${product.stock}، وأنت لديك في السلة: ${currentQtyInCart}` 
      });
    }

    // ✅ لو كله تمام، كمل عادي
    if (existingItem) {
      existingItem.quantity += Number(quantity);
    } else {
      cart.push({ productId, quantity: Number(quantity) });
    }

    res.cookie('cart', JSON.stringify(cart), { httpOnly: true });
    res.json(cart);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const removeFromCart = (req, res) => {
  let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
  cart = cart.filter(i => i.productId !== req.params.id);
  res.cookie('cart', JSON.stringify(cart), { httpOnly: true });
  res.json(cart);
}