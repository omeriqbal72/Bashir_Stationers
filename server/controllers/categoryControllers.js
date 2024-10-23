const Company = require('../models/company');
const Category = require('../models/category');
const Product = require('../models/products');

const getCategoriesWithLatestProducts = async (req, res) => {
    try {
      const categories = await Category.find({ name: { $in: ['Writing Tools', 'Art Tools', 'School Supplies'] } })
        .populate({
          path: 'products',
          options: { sort: { createdAt: -1 }, limit: 10 }, 
          populate: {
            path: 'company',
            select: 'name',
          },
        })
        .exec();
  
      res.status(200).json(categories);
  
    } catch (error) {
      console.error('Error fetching categories with latest products:', error);
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
  getCategoriesWithLatestProducts,
};
