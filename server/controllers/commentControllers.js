const Product = require('../models/products');
const Comment = require('../models/comment');
const User = require('../models/user');
const Order = require('../models/order')


const getComments = async(req , res)=>{
    try {
        const product = await Product.findById(req.params.id)
            .populate({
                path: 'comments',
                populate: { path: 'user', select: 'firstName' } 
            });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.status(200).json(product.comments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const postComment = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.userId;
    const { content, rating } = req.body;

    // Check if the rating is between 1 and 5
    if (rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Check if the user has purchased this product
        const order = await Order.findOne({
            user: userId,
            'products.product': productId,
            // 'products.reviewed': false, 
            orderStatus: 'Completed' 
        });
        

        if (!order) {
            return res.status(403).json({ message: 'You can only review products you have purchased' });
        }

        // Check if the user has already reviewed this product
        const existingReview = await Comment.findOne({ product: productId, user: userId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        const pictures = req.files ? req.files.map(file => file.path) : []; // Handle file uploads

        const newComment = new Comment({
            content,
            rating,
            product: productId,
            user: userId,
            pictures, // Save file paths
        });

        await newComment.save();

        product.comments.push(newComment._id);

        const allComments = await Comment.find({ product: productId });
        const totalRating = allComments.reduce((sum, comment) => sum + comment.rating, 0);
        product.averageRating = totalRating / allComments.length;

        await product.save();

        // Mark the product as reviewed in the order
        await Order.updateOne(
            { _id: order._id, 'products.product': productId },
            { $set: { 'products.$.reviewed': true } }
        );

        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getUnreviewedProducts = async (req, res) => {
    const userId = req.user.userId;  // Assuming you are using JWT or session to get logged-in user's ID

    try {
        // Find orders for the user that are 'Completed' and populate the products
        const orders = await Order.find({
            user: userId,
            orderStatus: 'Completed',
        }).populate('products.product'); // Populate the 'product' field in products

        // Flatten and filter the products that are not reviewed
        const unreviewedProducts = orders.flatMap(order => 
            order.products
                .filter(product => product.reviewed === false)
                .map(product => ({
                    _id: product._id,
                    product: product.product, // The populated product details
                    priceAtPurchase: product.priceAtPurchase, // Include the purchase price
                    quantity: product.quantity // Include the quantity
                }))
        );

        // Respond with the unreviewed products
        res.status(200).json({
            success: true,
            unreviewedProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching unreviewed products'
        });
    }
};


module.exports = {
    getComments,
    postComment,
    getUnreviewedProducts
}