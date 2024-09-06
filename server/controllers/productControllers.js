const Category = require('../models/category'); // Adjust the path to your Category model
const SubCategory = require('../models/subcategory');

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('subcategories');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching categories', error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
       
        const productId = req.params.id;
        const product = await Product.findById(productId).populate('category').populate('subCategory').populate('type');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getProductsByCategoryName = async (req, res) => {
    try {
        const categoryName = req.params.categoryname; // Correct parameter name
        console.log("Category Name from Request Params:", categoryName);

        // Find the category by name and populate the products array
        const category = await Category.findOne({ name: categoryName }).populate('products');
        console.log("Category Found:", category);

        if (!category) {
            console.log("Category Not Found");
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(category.products);
    } catch (error) {
        console.log("Error Occurred:", error.message);
        res.status(500).json({ message: 'An error occurred while fetching products', error: error.message });
    }
};


const getProductsBySubCategoryName = async (req, res) => {
    try {

        console.log("Request Params:", req.params);

        const subCategoryName = req.params.subcategoryname;
        
        console.log("Subcategory Name from Request Params:", subCategoryName);

        const subCategory = await SubCategory.findOne({ name: subCategoryName }).populate('products');

        console.log("Found Subcategory:", subCategory);

        if (!subCategory) {
            console.log('Subcategory not found');
            return res.status(404).json({ message: 'SubCategory not found' });
        }

        // Log the products array before sending the response
        console.log("Products in Subcategory:", subCategory.products);

        res.status(200).json(subCategory.products);
    } catch (error) {
        // Log the error message
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'An error occurred while fetching products', error: error.message });
    }
};

module.exports = {
     getAllCategories,
     getProductsByCategoryName,
     getProductsBySubCategoryName
     };
