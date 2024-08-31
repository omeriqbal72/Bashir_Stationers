const Company = require('../models/company');
const Category = require('../models/category');
const Product = require('../models/products');
const ProductType = require('../models/productType');
const SubCategory = require('../models/subcategory')
const fs = require('fs').promises;
const path = require('path');


const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('company')
            .populate('category')
            .populate('subCategory')
            .populate('type');

        res.status(200).json(products);
        console.log(products)
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        // Extract product ID from request parameters
        const productId = req.params.id;

        // Fetch the product from the database
        const product = await Product.findById(productId).populate('category').populate('subCategory').populate('type');

        // Check if the product exists
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Return the product data
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const addProduct = async (req, res) => {
    try {
        const { name, company, category, subCategory, type, colors, description, quantity, price } = req.body;

        // Parse colors JSON string to array
        let colorArray = [];
        try {
            colorArray = JSON.parse(colors);
        } catch (error) {
            return res.status(400).json({ message: "Invalid colors format" });
        }

        // Handle image paths
        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => file.path);
        } else {
            imagePaths.push('uploads/productImages/default-image.png');
        }

        // Handle company
        let companyId = company;
        if (!company || company.trim() === "") {
            return res.status(400).json({ message: "Company name is required" });
        }

        let existingCompany = await Company.findOne({ name: company });
        if (existingCompany) {
            companyId = existingCompany._id;
        } else {
            const newCompany = new Company({ name: company });
            existingCompany = await newCompany.save();
            companyId = existingCompany._id;
        }

        // Handle category
        let categoryId = null;
        let existingCategory = await Category.findOne({ name: category });
        if (existingCategory) {
            categoryId = existingCategory._id;
        } else {
            const newCategory = new Category({ name: category });
            const savedCategory = await newCategory.save();
            categoryId = savedCategory._id;
        }

        // Handle subCategory
        let subCategoryId = null;
        let existingSubCategory = await SubCategory.findOne({ name: subCategory, category: categoryId });
        if (existingSubCategory) {
            subCategoryId = existingSubCategory._id;
        } else {
            const newSubCategory = new SubCategory({ name: subCategory, category: categoryId });
            const savedSubCategory = await newSubCategory.save();
            subCategoryId = savedSubCategory._id;

            // Add the new subCategory to the associated category
            await Category.findByIdAndUpdate(
                categoryId,
                { $addToSet: { subcategories: subCategoryId } },
                { new: true }
            );
        }

        // Handle type
        let typeId = null;
        let existingType = await ProductType.findOne({ name: type, subcategory: subCategoryId });
        if (existingType) {
            typeId = existingType._id;
        } else {
            const newType = new ProductType({ name: type, subcategory: subCategoryId });
            const savedType = await newType.save();
            typeId = savedType._id;
        }

        // Create the new product
        const newProduct = await Product.create({
            name,
            company: companyId,
            category: categoryId,
            subCategory: subCategoryId,
            type: typeId,
            colors: colorArray,
            description,
            quantity,
            price,
            images: imagePaths,
        });

        // Update company with the new product ID
        existingCompany.products.push(newProduct._id);
        await existingCompany.save();

        // Update category with the new product ID
        await Category.findByIdAndUpdate(
            categoryId,
            { $addToSet: { products: newProduct._id } },
            { new: true }
        );

        // Update subCategory with the new product ID
        await SubCategory.findByIdAndUpdate(
            subCategoryId,
            { $addToSet: { products: newProduct._id } },
            { new: true }
        );

        // Update type with the new product ID
        await ProductType.findByIdAndUpdate(
            typeId,
            { $addToSet: { products: newProduct._id } },
            { new: true }
        );

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while adding the product', error: error.message });
    }
};


const editProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, price, companyName, quantity, colors, description } = req.body;
        const removedImages = req.body.removedImages ? req.body.removedImages.split(',').map(img => img.trim()).filter(img => img) : [];
        const newImages = req.files ? req.files.map(file => file.path) : [];

        // Parse colors if they come as a stringified array
        let colorArray = [];
        try {
            colorArray = JSON.parse(colors);
        } catch (error) {
            return res.status(400).json({ message: "Invalid colors format" });
        }

        console.log('Received Product ID:', productId);
        console.log('Request Body:', { name, price, companyName, quantity, colors, description });
        console.log('Removed Images:', removedImages);
        console.log('New Images:', newImages);

        // Fetch the product to be edited
        let product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Handle company reassignment
        if (companyName) {
            let newCompany = await Company.findOne({ name: companyName });
            if (!newCompany) {
                newCompany = new Company({ name: companyName });
                await newCompany.save();
            }

            // If the company is being changed, update the old and new company products arrays
            if (!newCompany._id.equals(product.company)) {
                // Remove product from old company's products array
                await Company.findByIdAndUpdate(product.company, {
                    $pull: { products: product._id }
                });

                // Add product to new company's products array
                newCompany.products.push(product._id);
                await newCompany.save();

                // Update the product's company reference
                product.company = newCompany._id;
            }
        }

        // Update other product fields
        if (name) product.name = name;
        if (price) product.price = price;
        if (description) product.description = description;
        if (quantity) product.quantity = quantity;
        if (colors) product.colors = colorArray;

        // Handle images
        if (newImages.length > 0) {
            product.images.push(...newImages);
        }

        if (removedImages.length > 0) {
            product.images = product.images.filter(img => !removedImages.includes(img));
            removedImages.forEach(imgPath => {
                fs.unlink(path.join(__dirname, '..', imgPath), (err) => {
                    if (err) {
                        console.error(`Failed to delete ${imgPath}:`, err);
                    } else {
                        console.log(`File ${imgPath} deleted successfully.`);
                    }
                });
            });
        }

        // Save the updated product
        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({
            message: "An error occurred while updating the product",
            error: error.message,
        });
    }
};



const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // Find the product
        const product = await Product.findById(productId);
        if (!product) {
            console.error(`Product with ID ${productId} not found`);
            return res.status(404).json({ message: 'Product not found' });
        }

        // Remove the product from the associated company's products array
        await Company.findByIdAndUpdate(product.company, {
            $pull: { products: product._id }
        });

        // Remove the product from the respective categories' products arrays
        await Category.updateMany(
            { _id: { $in: product.categories } }, // Find categories that include this product
            { $pull: { products: product._id } }  // Remove the product ID from the products array
        );

        // Remove the product from the respective types' products arrays
        if (product.type) {
            await ProductType.findByIdAndUpdate(product.type, {
                $pull: { products: product._id }
            });
        }

        // Log the current directory
        console.log('Current Directory:', __dirname);

        // Construct and log the path to the image
        if (product.image && product.image.startsWith('uploads/productImages/')) {
            const imagePath = path.resolve(__dirname, '..', '..', product.image);
            console.log('Attempting to delete file at:', imagePath);

            try {
                await fs.access(imagePath);
                await fs.unlink(imagePath);
                console.log('File deleted successfully');
            } catch (err) {
                console.error('Failed to delete image:', err);
                return res.status(500).json({ message: 'Failed to delete image' });
            }
        } else {
            console.log('No valid image path to delete or image path does not start with "uploads/productImages/"');
        }

        // Delete the product
        await product.deleteOne();

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }
};




module.exports = {
    addProduct,
    editProduct,
    deleteProduct,
    getProducts,
    getProductById,
};
