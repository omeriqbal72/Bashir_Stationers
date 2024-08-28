const express = require("express");
const router = express.Router();
const { getTest } = require('../controllers/authControllers')
const { getProducts ,addProduct, editProduct, deleteProduct , getProductById} = require('../controllers/productControllers');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            cb(null, './uploads/productImages'); // Specify the destination folder
        } catch (error) {
            cb(error, null);
        }
    },
    filename: function (req, file, cb) {
        try {
            if (file.originalname === 'defaultprofile.png') {
                cb(null, 'default-image.png');
            } else {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
                cb(null, filename);
            }
        } catch (error) {
            cb(error, null);
        }
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (!file) {
            return cb(new Error('No file uploaded'));
        }
        cb(null, true);
    }
}).array('images', 5); // Allow up to 5 images, adjust as needed






router.post('/add-product', upload, addProduct);

router.put('/edit-product/:productId', upload, editProduct);
router.get('/test', getTest);
router.get('/admin/edit-product/:id', getProductById);
router.get('/get-products' , getProducts);

router.delete('/delete-product/:productId', deleteProduct);

module.exports = router;
