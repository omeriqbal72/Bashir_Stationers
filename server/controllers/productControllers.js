const Category = require('../models/category'); // Adjust the path to your Category model

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('subcategories');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching categories', error: error.message });
    }
};



module.exports = {
     getAllCategories,
     
     };
