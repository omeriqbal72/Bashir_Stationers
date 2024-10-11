const Order = require('../models/order');
const Product = require('../models/products');
const User = require('../models/user');
const { sendOrderConfirmationEmail, generateVerificationCode, sendOrderVerificationEmail } = require('../middlewares/jwt.js');

const pendingOrders = {};
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

    const orders = await Order.find({ user: userId });
      

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

    console.log('Starting placeOrder...');  // Debugging

    let user = await User.findById(userId);
    if (!user) {
      console.error('User not found');  // Log error
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's contact number if necessary
    if (!user.contactNumber && contactNumber) {
      user.contactNumber = contactNumber;
      await user.save();
    }

    // Calculate the total amount
    const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
    console.log('Total amount calculated:', totalAmount);  // Debugging

    // Create a new order
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
        country: address.state,
      },
      totalAmount,
      paymentMethod: paymentMethod === 'online-payment' ? 'Stripe' : 'Cash on Delivery',
    });

    const savedOrder = await newOrder.save();
    console.log('Order saved:', savedOrder._id);  // Debugging

    // Update the product quantities
    await Promise.all(
      cart.map(async (item) => {
        const product = await Product.findById(item.product._id);
        if (!product) {
          console.error(`Product with ID ${item.product._id} not found`);
          throw new Error(`Product with ID ${item.product._id} not found`);
        }
    
        await Product.findOneAndUpdate(
          { _id: item.product._id },
          { $inc: { quantity: -item.quantity } }, 
          { new: true, useFindAndModify: false }
        );
    
        console.log(`Updated quantity for product ID ${item.product._id}`);
      })
    );

    // Send Order Confirmation Email
    await sendOrderConfirmationEmail(user.email, savedOrder);

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error placing order:', error);  // Log the error for debugging
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};


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

const sendOrderVerifyCode = async (req, res) => {
  const { cart, address, paymentMethod, contactNumber, emailAddress } = req.body;

  if (!emailAddress) {
    return res.status(400).json({ message: 'Email or contact number is required.' });
  }

  const verificationCode = generateVerificationCode();

  try {
    // Send verification email
    await sendOrderVerificationEmail(emailAddress, verificationCode);

    pendingOrders[emailAddress] = {
      cart,
      address,
      paymentMethod,
      contactNumber,
      verificationCode,
    };
    console.log(pendingOrders)

    return res.status(200).json({ message: 'Verification code sent to email.' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Failed to send verification email.' });
  }
}

const enterOrderVerifyCode = async (req, res) => {
  const { email, verificationCode } = req.body;

  // Check if a pending order exists for the provided email address
  const pendingOrder = pendingOrders[email];
  if (!pendingOrder) {
    console.error(`No pending order found for email: ${email}`);
    return res.status(400).json({ message: 'No pending order found for this email.' });
  }

  // Log the verification process
  console.log('Pending Order Verification Code:', pendingOrder.verificationCode);
  console.log('Received Verification Code:', verificationCode);

  if (pendingOrder.verificationCode.trim() !== verificationCode.trim()) {
    console.error('Invalid verification code.');
    return res.status(400).json({ message: 'Invalid verification code.' });
  }

  try {
    // Check if guest user exists or create a new guest user
    let user = await User.findOne({ email });

    if (!user) {
      const randomPassword = await bcrypt.hash(generateRandomPassword(), 10);
      const guestLastNameCount = await User.countDocuments({ firstName: 'Guest' }) + 1;

      user = new User({
        firstName: 'Guest',
        lastName: guestLastNameCount.toString(),
        email,
        password: randomPassword,
        role: 'guest',
      });

      await user.save();
      console.log('New guest user created:', user);
    } else {
      console.log('Existing user found:', user);
    }

    const totalAmount = pendingOrder.cart.reduce((sum, item) => {
      console.log('Cart Item:', item);
      return sum + item.quantity * item.product.price;
    }, 0);

    // Create a new order using the mapped product structure
    const newOrder = new Order({
      user: user._id,
      products: pendingOrder.cart.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        priceAtPurchase: item.product.price,
        selectedColor: item.selectedColor,
      })),
      shippingAddress: {
        street: pendingOrder.address.street,
        city: pendingOrder.address.city,
        postalCode: pendingOrder.address.zipCode,
        country: pendingOrder.address.state,
      },
      totalAmount,
      paymentMethod: pendingOrder.paymentMethod === 'online-payment' ? 'Stripe' : 'Cash on Delivery',
    });

    const savedOrder = await newOrder.save();
    console.log('Order saved successfully:', savedOrder);

    await Promise.all(
      pendingOrder.cart.map(async (item) => {
        const product = await Product.findById(item.product._id);
        if (!product) {
          console.error(`Product with ID ${item.product._id} not found`);  // Log error
          throw new Error(`Product with ID ${item.product._id} not found`);
        }
        product.quantity -= item.quantity; // Subtract ordered quantity
        if (product.quantity < 0) {
          product.quantity = 0;  // Ensure quantity doesn't go negative
        }
        await product.save();
        console.log(`Updated quantity for product ID ${product._id}`);  // Debugging
      })
    );

    await sendOrderConfirmationEmail(email, savedOrder);

    delete pendingOrders[email];

    return res.status(200).json({ message: 'Order placed successfully.' });
  } catch (error) {
    console.error('Error while placing order:', error);
    return res.status(500).json({ message: 'Failed to place order.' });
  }
};



function generateRandomPassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

const orderStatusStats = async (req, res) => {
  try {
    // Aggregate count of orders by status
    const completedOrders = await Order.countDocuments({ orderStatus: 'Completed' });
    const canceledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });

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

const getSingleOrderbyId = async (req, res) => {
  try {
    // Find the order by ID and populate the user and product details
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email') // Populate user details
      .populate({
        path: 'products.product', // Populate the products array
        model: 'Product', // Specify the model to populate
        select: 'name price images', // Select specific fields from Product model
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order); // Send the populated order back to the client
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  getOrderbyId,
  updateOrderStatus,
  orderStats,
  salesperMonth,
  orderStatusStats,
  enterOrderVerifyCode,
  sendOrderVerifyCode,
  getSingleOrderbyId
}