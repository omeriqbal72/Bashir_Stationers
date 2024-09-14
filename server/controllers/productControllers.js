const Company = require('../models/company');
const Category = require('../models/category');
const Product = require('../models/products');
const ProductType = require('../models/productType');
const SubCategory = require('../models/subcategory');
const path = require('path');
const fs = require('fs');

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().populate('subcategories');
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while fetching categories', error: error.message });
    }
};

const getallProducts = async (req, res) => {
    try {
        const { page = 1, limit = 12 } = req.query;
        const pageInt = parseInt(page);  
        const limitInt = parseInt(limit);  
        const skip = (pageInt - 1) * limitInt;  

        // Fetch products with population, pagination, and limit
        const products = await Product.find()
            .populate('company')
            .populate('category')
            .populate('subCategory')
            .populate('type')
            .skip(skip)
            .limit(limitInt);

        const totalProducts = await Product.countDocuments();

        console.log(`Page: ${pageInt}, Products returned: ${products.length}, Total Products: ${totalProducts}`);

        res.status(200).json({
            products,
            currentPage: pageInt,
            totalPages: Math.ceil(totalProducts / limitInt),  // Calculate total pages
            totalProducts,  // Total number of products
        });
    } catch (error) {
        console.error('Failed to fetch products:', error.message);
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};



const getProductsByCategoryName = async (req, res) => {
    try {
        const { categoryname } = req.params;
        const { page = 1, limit = 12 } = req.query;
        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const limitInt = parseInt(limit, 10);

        console.log(`Fetching products for category: ${categoryname}, Page: ${page}, Limit: ${limit}`);

        // Find the category by name to get its ID
        const category = await Category.findOne({ name: categoryname }).exec();
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Fetch products by category ID and populate the company field
        const products = await Product.find({ category: category._id })
            .skip(skip)
            .limit(limitInt)
            .populate('company') // Populate the company field
            .exec();

        // Count total products by matching category
        const totalProducts = await Product.countDocuments({ category: category._id });

        console.log(`Page: ${page}, Products returned: ${products.length}, Total Products: ${totalProducts}`);
        console.log('Products returned:', products);

        res.status(200).json({
            products,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalProducts / limitInt),
            totalProducts,
        });
    } catch (error) {
        console.error('Error fetching products by category:', error.message);
        res.status(500).json({ message: 'An error occurred while fetching products', error: error.message });
    }
};

const getProductsBySubCategoryName = async (req, res) => {
    try {
        const { subcategoryname } = req.params;
        const { page = 1, limit = 12 } = req.query;
        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const limitInt = parseInt(limit, 10);

        console.log(`Fetching products for subcategory: ${subcategoryname}, Page: ${page}, Limit: ${limit}`);

        // Find the subcategory by name to get its ID
        const subCategory = await SubCategory.findOne({ name: subcategoryname }).exec();
        if (!subCategory) {
            return res.status(404).json({ message: 'SubCategory not found' });
        }

        // Fetch products by subcategory ID and populate the company field
        const products = await Product.find({ subCategory: subCategory._id })
            .skip(skip)
            .limit(limitInt)
            .populate('company')  // Populate the company field with the company document
            .exec();

        // Count total products by matching subcategory
        const totalProducts = await Product.countDocuments({ subCategory: subCategory._id });

        console.log(`Page: ${page}, Products returned: ${products.length}, Total Products: ${totalProducts}`);
        console.log('Products returned:', products);

        res.status(200).json({
            products,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalProducts / limitInt),
            totalProducts,
        });
    } catch (error) {
        console.error('Error fetching products by subcategory:', error.message);
        res.status(500).json({ message: 'An error occurred while fetching products', error: error.message });
    }
};

const getProductsByCompanyName = async (req, res) => {
    try {
        const { companyname } = req.params;
        const { page = 1, limit = 12 } = req.query;
        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const limitInt = parseInt(limit, 10);

        console.log(`Fetching products for company: ${companyname}, Page: ${page}, Limit: ${limit}`);

        // Find the company by name to get its ID
        const company = await Company.findOne({ name: companyname }).exec();

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Fetch products by company ID and populate the company field
        const products = await Product.find({ company: company._id })
            .skip(skip)
            .limit(limitInt)
            .populate('company')  // Populate the company field with the company document
            .exec();

        // Count total products by matching company
        const totalProducts = await Product.countDocuments({ company: company._id });

        console.log(`Page: ${page}, Products returned: ${products.length}, Total Products: ${totalProducts}`);
        console.log('Products returned:', products);

        res.status(200).json({
            products,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalProducts / limitInt),
            totalProducts,
        });
    } catch (error) {
        console.error('Error fetching products by company:', error.message);
        res.status(500).json({ message: 'An error occurred while fetching products', error: error.message });
    }
};

const getProductsByName = async (req, res) => {
    try {
        const { productname } = req.params;
        const { page = 1, limit = 12 } = req.query;
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        const skip = (pageInt - 1) * limitInt;

        console.log(`Fetching products by name: ${productname}, Page: ${pageInt}, Limit: ${limitInt}`);

        // Find products by name with pagination
        const products = await Product.find({ name: productname })
            .populate('company')
            .skip(skip)
            .limit(limitInt)
            .exec();

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found' });
        }

        // Count total products matching the name
        const totalProducts = await Product.countDocuments({ name: productname });

        console.log(`Page: ${pageInt}, Products returned: ${products.length}, Total Products: ${totalProducts}`);

        res.status(200).json({
            products,
            currentPage: pageInt,
            totalPages: Math.ceil(totalProducts / limitInt),
            totalProducts,
        });
    } catch (error) {
        console.error('Error fetching products by name:', error.message);
        res.status(500).json({ message: 'An error occurred while fetching products', error: error.message });
    }
};

const getProductsByProductTypeName = async (req, res) => {
    try {
        const { producttypename } = req.params;
        const { page = 1, limit = 12 } = req.query;
        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
        const limitInt = parseInt(limit, 10);

        console.log(`Fetching products for type: ${producttypename}, Page: ${page}, Limit: ${limit}`);

        // Find the product type by name to get its ID
        const productType = await ProductType.findOne({ name: producttypename }).exec();

        if (!productType) {
            return res.status(404).json({ message: 'Product Type not found' });
        }

        // Fetch products by product type ID and populate fields if needed
        const products = await Product.find({ type: productType._id })
            .skip(skip)
            .limit(limitInt)
            .populate('company')   // Populate company field if needed
            .exec();

        // Count total products by matching type
        const totalProducts = await Product.countDocuments({ type: productType._id });

        console.log(`Page: ${page}, Products returned: ${products.length}, Total Products: ${totalProducts}`);
        console.log('Products returned:', products);

        res.status(200).json({
            products,
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalProducts / limitInt),
            totalProducts,
        });
    } catch (error) {
        console.error('Error fetching products by type:', error.message);
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
    console.log('Search Params:', req.params);
    
    // Extract and sanitize the search term
    const searchTerm = (req.params.searched || '').toString().trim();
    console.log('Search Term:', searchTerm);

    // Extract pagination parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    if (searchTerm.length === 0) {
        console.log('No search term provided');
        return res.status(200).json({ products: [], currentPage: page, totalPages: 1, totalProducts: 0 });
    }

    try {
        // Find products and populate related fields
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

        // Calculate pagination
        const totalProducts = filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / limit);
        const paginatedProducts = filteredProducts.slice(skip, skip + limit);

        console.log('Number of Products:', paginatedProducts.length);

        // Send response with paginated products and pagination information
        res.status(200).json({
            products: paginatedProducts,
            currentPage: page,
            totalPages,
            totalProducts
        });
    } catch (error) {
        console.error('Error fetching detailed search results:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const checkFileExists = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                resolve(false); // File does not exist
            } else {
                resolve(true); // File exists
            }
        });
    });
};

const checkImagesExist = async (req, res) => {
    try {
        const { images } = req.query; // Get images array from query parameters
        if (!images) {
            return res.status(400).json({ message: 'No images provided' });
        }

        const imageArray = Array.isArray(images) ? images : images.split(',');
        const imageResponses = await Promise.all(imageArray.map(async (imageName) => {
            const imagePath = path.join(__dirname, 'uploads', 'productImages', imageName);
            const fileExists = await checkFileExists(imagePath);

            return {
                imageName,
                exists: fileExists,
                imageUrl: fileExists ? `/uploads/productImages/${imageName}` : "",
            };
        }));

        res.json(imageResponses);
    } catch (error) {
        console.error('Error checking images:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getallProducts,
    getAllCategories,
    getProductsByCategoryName,
    getProductsBySubCategoryName,
    getProductsByCompanyName,
    getProductsByProductTypeName,
    getProductsByName,
    SearchProducts,
    SearchbyIcon,
    checkImagesExist

};
