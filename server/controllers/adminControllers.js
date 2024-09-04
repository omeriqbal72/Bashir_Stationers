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
       
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
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

const addProduct = async (req, res) => {
    try {
        const { name, company, category, subCategory, type, colors, description, quantity, price } = req.body;

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
        if (!company || company.trim() === "") {
            return res.status(400).json({ message: "Company name is required" });
        }

        let existingCompany = await Company.findOne({ name: company });
        if (!existingCompany) {
            const newCompany = new Company({ name: company });
            existingCompany = await newCompany.save();
        }
        const companyId = existingCompany._id;

        // Handle category
        let existingCategory = await Category.findOne({ name: category });
        if (!existingCategory) {
            existingCategory = new Category({ name: category });
            existingCategory = await existingCategory.save();
        }
        const categoryId = existingCategory._id;

        // Handle subCategory
        let existingSubCategory = await SubCategory.findOne({ name: subCategory, category: categoryId });
        if (!existingSubCategory) {
            existingSubCategory = new SubCategory({ name: subCategory, category: categoryId });
            existingSubCategory = await existingSubCategory.save();

            // Add the new subCategory to the associated category
            await Category.findByIdAndUpdate(
                categoryId,
                { $addToSet: { subcategories: existingSubCategory._id } },
                { new: true }
            );
        }
        const subCategoryId = existingSubCategory._id;

        // Handle type (optional)
        let typeId = null;
        if (type && type.trim() !== "") {
           
            let existingType = await ProductType.findOne({ name: type , subcategory:subCategoryId });
            if (!existingType) {
                existingType = new ProductType({ name: type , subcategory: subCategoryId });
                existingType = await existingType.save();

                
                await SubCategory.findByIdAndUpdate(
                    subCategoryId,
                    { $addToSet: { types: existingType._id } },
                    { new: true }
                );
            }
            typeId = existingType._id;
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

        // If type is provided, update ProductType with the new product ID
        if (typeId) {
            await ProductType.findByIdAndUpdate(
                typeId,
                { $addToSet: { products: newProduct._id } },
                { new: true }
            );
        }

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error occurred:', error.stack);
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

        await Company.findByIdAndUpdate(product.company, {
            $pull: { products: product._id }
        });

        await SubCategory.findByIdAndUpdate(product.subCategory, {
            $pull: { products: product._id }
        });

        await Category.findByIdAndUpdate(product.category, {
            $pull: { products: product._id }
        });

        if (product.type) {
            await ProductType.findByIdAndUpdate(product.type, {
                $pull: { products: product._id }
            });
        }

        console.log('Current Directory:', __dirname);

        if (product.images && product.images.length > 0) {
            for (const imagePath of product.images) {
                if (imagePath.startsWith('uploads/productImages/')) {
                    const fullPath = path.resolve(__dirname, '..', '..', imagePath);
                    console.log('Attempting to delete file at:', fullPath);

                    try {
                        await fs.access(fullPath);
                        await fs.unlink(fullPath);
                        console.log('File deleted successfully');
                    } catch (err) {
                        console.error('Failed to delete image:', err);
                        return res.status(500).json({ message: 'Failed to delete image' });
                    }
                } else {
                    console.log('No valid image path to delete or image path does not start with "uploads/productImages/"');
                }
            }
        }

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
