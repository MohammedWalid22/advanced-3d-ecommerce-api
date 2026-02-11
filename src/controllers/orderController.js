import Order from '../models/Order.js';
import Product from '../models/Product.js'; 

export const createOrder = async (req, res) => {
  try {
    let orderItems = req.body.items;

    if (!orderItems && req.cookies.cart) {
      const cart = JSON.parse(req.cookies.cart);
      orderItems = cart.map(item => ({
        product: item.productId,
        quantity: Number(item.quantity)
      }));
    }

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: "No items in cart" });
    }

    let calculatedTotal = 0; 

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
      if (item.quantity > product.stock) {
        return res.status(400).json({ message: `عفواً، الكمية المطلوبة من ${product.name} غير متاحة.` });
      }
      calculatedTotal += product.price * item.quantity;
    }

    const { shippingAddress, paymentMethod } = req.body;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount: calculatedTotal,
      shippingAddress,
      paymentMethod
    });

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = product.stock - item.quantity;
        await product.save();
      }
    }

    res.clearCookie('cart');
    res.status(201).json(order);

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ message: error.message });
  }
}

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// 👇 دي الدالة الجديدة المهمة جداً
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (order) {
      // 🛡️ التحقق: هل أنت صاحب الطلب؟ أو هل أنت أدمن؟
      // (لاحظ: بنستخدم role === 'admin' عشان تمشي مع ملف admin.js بتاعك)
      if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
        res.json(order)
      } else {
        res.status(403).json({ message: 'Not authorized to view this order' })
      }
    } else {
      res.status(404).json({ message: 'Order not found' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}