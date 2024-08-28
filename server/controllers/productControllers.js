const Company = require('../models/company');
const Category = require('../models/category');
const Product = require('../models/products');
const ProductType = require('../models/productType');
const fs = require('fs').promises;
const path = require('path');


const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate('company')
            .populate('categories')
            .populate('type');

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        // Extract product ID from request parameters
        const productId = req.params.id;

        // Fetch the product from the database
        const product = await Product.findById(productId).populate('categories').populate('type');

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
        const { name, company, categories, type, colors, quantity, price } = req.body;

        // Parse categories JSON string to array
        let categoryArray = [];
        try {
            categoryArray = JSON.parse(categories);
        } catch (error) {
            return res.status(400).json({ message: "Invalid categories format" });
        }

        // Parse colors JSON string to array
        let colorArray = [];
        try {
            colorArray = JSON.parse(colors);
        } catch (error) {
            return res.status(400).json({ message: "Invalid colors format" });
        }

        // Ensure the company name is being handled properly
        let companyId = company;
        let categoryIds = [];
        let typeId = null;

        let imagePaths = [];
        if (req.files && req.files.length > 0) {
            imagePaths = req.files.map(file => file.path);
        } else {
            imagePaths.push('uploads/productImages/default-image.png');
        }

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

        if (!categoryArray || !Array.isArray(categoryArray) || categoryArray.length === 0) {
            return res.status(400).json({ message: "At least one category is required" });
        }

        for (const category of categoryArray) {
            if (!category || category.trim() === "") continue;

            let existingCategory = await Category.findOne({ name: category });
            if (existingCategory) {
                categoryIds.push(existingCategory._id);
            } else {
                const newCategory = new Category({ name: category });
                const savedCategory = await newCategory.save();
                categoryIds.push(savedCategory._id);
            }
        }

        let existingType = await ProductType.findOne({ name: type, category: categoryIds[0] });
        if (existingType) {
            typeId = existingType._id;
        } else {
            const newType = new ProductType({ name: type, category: categoryIds[0] });
            existingType = await newType.save();
            typeId = existingType._id;
        }

        for (const categoryId of categoryIds) {
            await Category.findByIdAndUpdate(
                categoryId,
                { $addToSet: { types: typeId } },
                { new: true }
            );
        }

        const newProduct = await Product.create({
            name,
            company: companyId,
            categories: categoryIds,
            type: typeId,
            colors: colorArray, // Save colors array
            quantity,
            price,
            images: imagePaths,
        });

        existingCompany.products.push(newProduct._id);
        await existingCompany.save();

        for (const categoryId of categoryIds) {
            await Category.findByIdAndUpdate(
                categoryId,
                { $addToSet: { products: newProduct._id } },
                { new: true }
            );
        }

        existingType.products.push(newProduct._id);
        await existingType.save();

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while adding the product', error: error.message });
    }
};






const editProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, price, companyName, categories: categoriesStr, typeName, quantity, colors } = req.body;
        const removedImages = req.body.removedImages ? req.body.removedImages.split(',').map(img => img.trim()).filter(img => img) : [];
        const newImages = req.files ? req.files.map(file => file.path) : [];

        // Parse categories if they come as a stringified array
        const categories = Array.isArray(categoriesStr) ? categoriesStr : JSON.parse(categoriesStr);
        let colorArray = [];
        try {
            colorArray = JSON.parse(colors);
        } catch (error) {
            return res.status(400).json({ message: "Invalid colors format" });
        }
        console.log('Received Product ID:', productId);
        console.log('Request Body:', { name, price, companyName, categories, typeName, quantity, colors });
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

        // Handle category and type reassignment
        if (categories && categories.length > 0) {
            console.log('Processing Categories:', categories); // Log categories being processed

            // Fetch the old categories to remove the product from
            const oldCategories = await Category.find({ _id: { $in: product.categories } });
            const oldCategoryIds = oldCategories.map(cat => cat._id);

            // Clear the current categories array in the product
            product.categories = [];

            for (const categoryName of categories) {
                let category = await Category.findOne({ name: categoryName });
                if (!category) {
                    category = new Category({ name: categoryName });
                    console.log('Creating new category:', category);
                    await category.save();
                }
                product.categories.push(category._id);

                // Only create or assign a new type if the typeName has changed
                if (typeName) {
                    // Populate the existing type to ensure the name is available for comparison
                    if (product.type) {
                        await product.populate('type'); // No need for execPopulate
                    }
        
                    // Only proceed if the type needs to be changed
                    if (!product.type || product.type.name !== typeName) {
                        // Handle the old type removal if necessary
                        if (product.type) {
                            await ProductType.findByIdAndUpdate(product.type._id, {
                                $pull: { products: product._id }
                            });
                        }

                        // Find or create the new type
                        let type = await ProductType.findOne({ name: typeName, category: category._id });

                        // If the type doesn't exist, create a new one
                        if (!type) {
                            type = new ProductType({ name: typeName, category: category._id });
                            await type.save();

                            // Add the new type to the category's types array
                            category.types.push(type._id);
                            await category.save();
                        }

                        // Add the product to the new type's products array
                        type.products.push(product._id);
                        await type.save();

                        // Assign the found or newly created type to the product
                        product.type = type._id;
                    } else {
                        console.log('Type remains unchanged, no update needed');
                    }
                }




            }

            // Remove the product from old categories
            await Category.updateMany(
                { _id: { $in: oldCategoryIds } },
                { $pull: { products: product._id } }
            );

            // Add the product to new categories
            await Category.updateMany(
                { _id: { $in: product.categories } },
                { $addToSet: { products: product._id } }
            );
        }

        // Update other product fields
        if (name) product.name = name;
        if (price) product.price = price;
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
