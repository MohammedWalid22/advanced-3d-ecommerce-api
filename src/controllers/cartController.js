import Product from '../models/Product.js'; 

export const getCart = (req, res) => {
  const cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
  res.json(cart);
}


export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }

   
    let cart = req.cookies.cart ? JSON.parse(req.cookies.cart) : [];
    
   
    const existingItem = cart.find(i => i.productId === productId);
    
   
    const currentQtyInCart = existingItem ? existingItem.quantity : 0;
    const totalRequested = currentQtyInCart + Number(quantity);

   
    if (totalRequested > product.stock) {
      return res.status(400).json({ 
        message: `عفواً، الكمية غير متاحة. المتاح: ${product.stock}، وأنت لديك في السلة: ${currentQtyInCart}` 
      });
    }

    
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
