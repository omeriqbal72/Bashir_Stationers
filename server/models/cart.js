const mongoose = require('mongoose');

// Cart Item Schema
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
    required: true,
  },
  selectedColor: {
    type: String,
  },

}, { _id: false }); 

// Cart Schema
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  totalPrice: {
    type: Number,
    default: 0,
  },
  totalQuantity: {
    type: Number,
    default: 0, 
  },
}, { timestamps: true });

// Middleware to auto-calculate total price and quantity before saving the cart
cartSchema.pre('save', function (next) {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + item.quantity * item.product.price; // Using price from the product reference
  }, 0);

  this.totalQuantity = this.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  next();
});

const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
