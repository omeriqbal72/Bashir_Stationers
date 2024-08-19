const Company = require('../models/company');
const Category = require('../models/category');
const Product = require('../models/products');
const ProductType = require('../models/productType');
const fs = require('fs');
const path = require('path');

const addProduct = async (req, res) => {
    try {
        const { name, company, category, type, price } = req.body;
        let companyId = company;
        let categoryId = category;

        console.log(req.file)

        // if (!req.file) {
        //     return res.status(400).json({ message: 'No file uploaded' });
        //   }
      
          //const imagePath = `uploads/productImages/${req.file.filename}` || 'path/to/your/default/image.jpg';
          let imagePath = '';
          if (req.file) {
              imagePath = req.file.path; // Multer saves the file path here
          }
          console.log('imagePath:', imagePath); // For debugging
        // Ensure the company name is being handled properly
        if (!company || company.trim() === "") {
            return res.status(400).json({ message: "Company name is required" });
        }

        // Fetch or create Company
        const existingCompany = await Company.findOne({ name: company });
        if (existingCompany) {
            companyId = existingCompany._id;
        } else {
            const newCompany = new Company({ name: company });
            const savedCompany = await newCompany.save();
            companyId = savedCompany._id;
        }

        // Fetch or create Category
        if (!category || category.trim() === "") {
            return res.status(400).json({ message: "Category name is required" });
        }

        const existingCategory = await Category.findOne({ name: category });
        if (existingCategory) {
            categoryId = existingCategory._id;
        } else {
            const newCategory = new Category({ name: category });
            const savedCategory = await newCategory.save();
            categoryId = savedCategory._id;
        }

        // Fetch or create ProductType
        const existingType = await ProductType.findOne({ name: type, category: categoryId });
        let typeId = null;
        if (existingType) {
            typeId = existingType._id;
        } else {
            const newType = new ProductType({ name: type, category: categoryId });
            const savedType = await newType.save();
            typeId = savedType._id;
        }

       
        // Add product
        const newProduct = new Product({
            name,
            company: companyId,
            category: categoryId,
            type: typeId,
            price,
            image: imagePath,
        });



        const savedProduct = await newProduct.save();

        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while adding the product', error: error.message });
    }
};




const editProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, price, companyName, categoryName, typeName } = req.body;

        let product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        if (companyName) {
            let company = await Company.findOne({ name: companyName });
            if (!company) {
                company = new Company({ name: companyName });
                await company.save();
            }
            product.company = company._id;
        }

        if (categoryName) {
            let category = await Category.findOne({ name: categoryName });
            if (!category) {
                category = new Category({ name: categoryName });
                await category.save();
            }
            product.category = category._id;

            if (typeName) {
                let type = await ProductType.findOne({ name: typeName, category: category._id });
                if (!type) {
                    type = new ProductType({ name: typeName, category: category._id });
                    await type.save();

                    category.types.push(type._id);
                    await category.save();
                }
                product.type = type._id;
            }
        }

        if (name) product.name = name;
        if (price) product.price = price;
        if (req.file) {
            product.image = req.file.path;
        }

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
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
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Delete the image file if it exists and is a valid file path
        if (product.image && product.image.startsWith('/uploads/')) {
            const imagePath = path.join(__dirname, '..', product.image);
            fs.unlink(imagePath, (err) => {
                if (err) console.error('Failed to delete image:', err);
            });
        }

        await product.deleteOne();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error' });
    }

    // try {
    //     const { productId } = req.params;

    //     const product = await Product.findByIdAndDelete(productId);
    //     if (!product) {
    //         return res.status(404).json({
    //             message: "Product not found",
    //         });
    //     }

    //     res.status(200).json({
    //         message: "Product deleted successfully",
    //     });
    // } catch (error) {
    //     res.status(500).json({
    //         message: "An error occurred while deleting the product",
    //         error: error.message,
    //     });
    // }
};

module.exports = {
    addProduct,
    editProduct,
    deleteProduct,
};
