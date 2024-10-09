const Product = require('../models/products');
const Comment = require('../models/comment');
const User = require('../models/user');


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

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const pictures = req.files.map(file => file.path); // Save file paths

        const newComment = new Comment({
            content,
            rating,
            product: productId,
            user: userId,
            pictures, 
        });

        await newComment.save();

        product.comments.push(newComment._id);

        const allComments = await Comment.find({ product: productId });
        const totalRating = allComments.reduce((sum, comment) => sum + comment.rating, 0);
        product.averageRating = totalRating / allComments.length;

        await product.save();

        res.status(201).json(newComment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getComments,
    postComment
}