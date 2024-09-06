const Company = require('../models/company');
const Category = require('../models/category');
const Product = require('../models/products');
const ProductType = require('../models/productType');
const SubCategory = require('../models/subcategory');

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('subcategories');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching categories', error: error.message });
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

        const subCategory = await SubCategory.findOne({ name: subCategoryName }).populate('products');

        console.log("Found Subcategory:", subCategory);

        if (!subCategory) {
            console.log('Subcategory not found');
            return res.status(404).json({ message: 'SubCategory not found' });
        }

        res.status(200).json(subCategory.products);
    } catch (error) {
        // Log the error message
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'An error occurred while fetching products', error: error.message });
    }
};

const getProductsByCompanyName = async (req, res) => {
    try {

        console.log("Request Params:", req.params);
        const companyName = req.params.companyname;

        const company = await Company.findOne({ name: companyName }).populate('products');

        if (!company) {
            console.log('Company not found');
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json(company.products);
    } catch (error) {
        // Log the error message
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'An error occurred while fetching products', error: error.message });
    }
};


const getProductsByName = async (req, res) => {
    try {
        // Extract the product name from request parameters
        console.log("Request Params:", req.params);
        const productName = req.params.productname;

        // Use a case-insensitive regex to search for products with the given name
        const products = await Product.find({
            name: productName
        })
        .populate('company')  // Populate company field if needed
        .populate('category') // Populate category field if needed
        .populate('subCategory') // Populate subCategory field if needed
        .populate('type') // Populate type field if needed
        .exec();

        // Check if any products are found
        if (products.length === 0) {
            console.log('No products found');
            return res.status(404).json({ message: 'No products found' });
        }

        // Return the found products
        res.status(200).json(products);
    } catch (error) {
        // Log the error message
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'An error occurred while fetching products', error: error.message });
    }
};

const getProductsByProductTypeName = async (req, res) => {
    try {
        console.log("Request Params:", req.params);
        const productTypeName = req.params.producttypename;

        const productType = await ProductType.findOne({ name: productTypeName }).populate('products');

        console.log("Found Product Type:", productType);

        if (!productType) {
            console.log('Product Type not found');
            return res.status(404).json({ message: 'Product Type not found' });
        }

        res.status(200).json(productType.products);
    } catch (error) {
        // Log the error message
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'An error occurred while fetching products', error: error.message });
    }
};



const SearchProducts = async (req, res) => {
    const query = req.query.q || '';
    const prefixRegex = new RegExp(`^${query}`, 'i');

    try {
        const products = await Product.find({ name: prefixRegex }).limit(10);
        const companies = await Company.find({ name: prefixRegex }).limit(10);
        const categories = await Category.find({ name: prefixRegex }).limit(10);
        const subcategories = await SubCategory.find({ name: prefixRegex }).limit(10);
        const productTypes = await ProductType.find({ name: prefixRegex }).limit(10);

        // Remove highlighting part for now
        res.json({
            products: products.map(product => ({
                _id: product._id,
                name: product.name,
                type: 'product'
            })),
            companies: companies.map(company => ({
                _id: company._id,
                name: company.name,
                type: 'company'
            })),
            categories: categories.map(category => ({
                _id: category._id,
                name: category.name,
                type: 'category'
            })),
            subcategories: subcategories.map(subcategory => ({
                _id: subcategory._id,
                name: subcategory.name,
                type: 'subcategory'
            })),
            productTypes: productTypes.map(type => ({
                _id: type._id,
                name: type.name,
                type: 'productType'
            }))
        });
    } catch (error) {
        console.error('Error performing search:', error);
        res.status(500).json({ message: 'Search failed' });
    }
};

const SearchbyIcon = async (req, res) => {
    console.log('Search Term:', req.params);

    // Extract and sanitize the search term
    const searchTerm = (req.params.searched || '').toString().trim();
    console.log('Search Term:', searchTerm);

    if (searchTerm.length === 0) {
        console.log('No search term provided');
        return res.status(200).json({ products: [] });
    }

    try {
        // First, find products and populate related fields
        const products = await Product.find({})
            .populate('company')  
            .populate('category') 
            .populate('subCategory') 
            .populate('type') 
            .exec();

        // Filter products that match the search term
        const filteredProducts = products.filter(product => {
            return (
                (product.name && product.name.match(new RegExp(searchTerm, 'i'))) ||
                (product.category && product.category.name && product.category.name.match(new RegExp(searchTerm, 'i'))) ||
                (product.subCategory && product.subCategory.name && product.subCategory.name.match(new RegExp(searchTerm, 'i'))) ||
                (product.type && product.type.name && product.type.name.match(new RegExp(searchTerm, 'i'))) ||
                (product.company && product.company.name && product.company.name.match(new RegExp(searchTerm, 'i')))
            );
        });

        console.log('Number of Products:', filteredProducts.length);

        res.status(200).json(filteredProducts );
    } catch (error) {
        console.error('Error fetching detailed search results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};






module.exports = {
    getAllCategories,
    getProductsByCategoryName,
    getProductsBySubCategoryName,
    getProductsByCompanyName,
    getProductsByProductTypeName,
    getProductsByName,
    SearchProducts,
    SearchbyIcon

};
