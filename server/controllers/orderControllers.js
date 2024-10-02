const Order = require('../models/order');


const getAllOrders = async (req , res) =>{
    try {
        const orders = await Order.find().populate('user');
        res.json(orders);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

const getOrderbyId = async (req , res) =>{
    try {
        const order = await Order.findById(req.params.id).populate('user');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

const updateOrderStatus = async (req , res) =>{
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId; // Get user ID from the decoded token

        // Find orders for the user and populate the product details
        const orders = await Order.find({ user: userId })
            .populate({
                path: 'products.product', // Specify the path to populate
                select: 'name images price' // Specify the fields to select from the Product model
            });

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }

        res.status(200).json(orders); // Send the orders back to the user
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving orders', error });
    }
};

const placeOrder = async (req, res) => {
    try {
        const { cart, address, paymentMethod } = req.body;
        const userId = req.user.userId;
    
        const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    
        const newOrder = new Order({
          user: userId,
          products: cart.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
            priceAtPurchase: item.product.price,
            selectedColor: item.selectedColor,
          })),
          shippingAddress: {
            street: address.street,
            city: address.city,
            postalCode: address.zipCode,
            country: address.state, // Can be modified as per your needs
          },
          totalAmount,
          paymentMethod: paymentMethod === 'online-payment' ? 'Stripe' : 'Cash on Delivery',
        });
    
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
      } catch (error) {
        res.status(500).json({ message: 'Error placing order', error });
      }   
}

module.exports = {
    placeOrder,
    getUserOrders,
    getAllOrders,
    getOrderbyId,
    updateOrderStatus

}