const Cart = require('../models/cart');
const Product = require('../models/products'); 

// Add to Cart API
const addToCart = async (req, res) => {
  try {
    const { productId, quantity, selectedColor } = req.body;
    const userId = req.user.userId;
    console.log(selectedColor)
    // Find the user's cart or create one if it doesn't exist
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the requested quantity exceeds available stock
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.selectedColor === selectedColor
    );
    const currentCartQuantity = existingItemIndex >= 0 ? cart.items[existingItemIndex].quantity : 0;
    const totalRequestedQuantity = currentCartQuantity + quantity;

    if (totalRequestedQuantity > product.quantity) {
      return res.status(400).json({
        message: `Requested quantity exceeds available stock. Only ${product.quantity - currentCartQuantity} item(s) left in stock.`,
      });
    }

    // Add to cart or update the quantity based on color
    if (existingItemIndex >= 0) {
      // Update the quantity of the existing item with the same color
      cart.items[existingItemIndex].quantity = totalRequestedQuantity;
    } else {
      // Add new product with a new color to the cart
      cart.items.push({ product: productId, quantity, selectedColor });
    }

    await cart.save();

    res.status(200).json({ message: 'Item added to cart successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



const removeFromCart = async (req, res) => {
  try {
    const { productId, selectedColor } = req.body;  // Expect color in request body
    const userId = req.user.userId;

    console.log('Product ID:', productId);
    console.log('Selected Color:', selectedColor);
    console.log('User ID:', userId);

    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Remove the item based on both product ID and selected color
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId || item.selectedColor !== selectedColor
    );

    await cart.save();

    res.status(200).json({ message: 'Item removed from cart successfully', cart });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
  
const getCart = async (req, res) => {
    try {
        const userId = req.user.userId; 
        const role = req.user.role;
        if(role === "admin"){
            return res.status(200).json({ message: 'No Cart' });
        } 

        const cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'items.product',
                model: 'Product'
            });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json({ cart });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateCart = async (req, res) => {
  try {
    const { productId, quantity, selectedColor } = req.body; 
    const userId = req.user.userId;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.selectedColor === selectedColor
    );

    if (itemIndex !== -1) {
      cart.items[itemIndex].quantity = quantity;

      if (cart.items[itemIndex].quantity < 1) {
        return res.status(400).json({ message: 'Quantity cannot be less than one' });
      }
    } else {
      return res.status(404).json({ message: 'Product with selected color not found in cart' });
    }

    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  getCart,
  removeFromCart,
  addToCart,
  updateCart
};
