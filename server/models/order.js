const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Order Schema
const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
      priceAtPurchase: {
        type: Number,
        required: true,
      },
      selectedColor: String,
      reviewed: {
        type: Boolean,
        default: false
      },
    },
  ],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: Number, required: true },
    country: { type: String, required: true },
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Stripe'],
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid', 'Failed'],
    default: 'Unpaid',
  },
  shippingStatus: {
    type: String,
    enum: ['Not Shipped', 'Shipped', 'Delivered'],
    default: 'Not Shipped',
  },
  trackingId: {
    type: Number,
    default: 0
  },

  deliveryDate: {
    type: Date,
  },
  transactionDetails: {
    transactionId: String,
    paymentGateway: String,
  },
});

module.exports = mongoose.model('Order', OrderSchema);
