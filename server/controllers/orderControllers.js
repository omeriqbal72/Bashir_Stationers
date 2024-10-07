const Order = require('../models/order');
const products = require('../models/products');
const User = require('../models/user');



const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getOrderbyId = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user').populate({
      path: 'products.product',
      model: 'Product'
    });;
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const updateOrderStatus = async (req, res) => {
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
    const userId = req.user.userId;

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
    const { cart, address, paymentMethod, contactNumber } = req.body;
    const userId = req.user.userId;

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.contactNumber && contactNumber) {
      user.contactNumber = contactNumber;
      await user.save();
    }

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

const orderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' },
        },
      },
    ]);

    res.json({
      totalOrders,
      pendingOrders,
      totalSales: totalSales.length ? totalSales[0].totalSales : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const salesperMonth = async (req, res) => {
  try {
    const salesPerMonth = await Order.aggregate([
      {
        $group: {
          _id: { month: { $month: '$orderDate' }, year: { $year: '$orderDate' } }, // Group by month and year
          monthlySales: { $sum: '$totalAmount' }, // Sum totalAmount for each month
          orderCount: { $sum: 1 }, // Count the number of orders for each month
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }, // Sort by year, then month
    ]);

    const formattedSales = salesPerMonth.map((sale) => ({
      month: sale._id.month,
      year: sale._id.year,
      totalSales: sale.monthlySales,
      numberOfOrders: sale.orderCount, // Add the order count to the response
    }));

    res.json(formattedSales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const orderStatusStats = async (req, res) => {
  try {
    // Aggregate count of orders by status
    const completedOrders = await Order.countDocuments({ orderStatus: 'Completed' });
    const canceledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

    // Return the counts as a JSON response
    return res.status(200).json({
      completedOrders,
      canceledOrders,
      pendingOrders,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch order status stats' });
  }
}


module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  getOrderbyId,
  updateOrderStatus,
  orderStats,
  salesperMonth,
  orderStatusStats
}