const express = require("express");
const router = express.Router();
const { getProducts, addProduct, editProduct, deleteProduct, getProductById } = require('../controllers/adminControllers.js');
const { getAllCategories, getProductsByCategoryName, getProductsBySubCategoryName, SearchProducts,
    getProductsByCompanyName, getProductsByProductTypeName, SearchbyIcon, getProductsByName,
    checkImagesExist, getallProducts } = require('../controllers/productControllers.js');
const { getCart,addToCart,removeFromCart , updateCart } = require('../controllers/cartControllers.js');
const { register , verifyEmail , login , refreshToken , logout , requestNewCode , getMe } = require('../controllers/authControllers.js');
const {  verifyToken} = require('../middlewares/jwt.js');


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
}).array('images', 5); 


router.post('/add-product', verifyToken, upload, addProduct);

router.put('/edit-product/:productId',verifyToken , upload, editProduct);

router.get('/admin/edit-product/:id', getProductById);
router.get('/product/:id', getProductById);
router.get('/get-products', getProducts);
router.get('/products/category/:categoryname', getProductsByCategoryName);
router.get('/products/subcategory/:subcategoryname', getProductsBySubCategoryName);
router.get('/products/company/:companyname', getProductsByCompanyName);
router.get('/products/type/:producttypename', getProductsByProductTypeName);
router.get('/get-categories', getAllCategories);
router.get('/get-search-products', SearchProducts);
router.get('/products/search/:searched', SearchbyIcon);
router.get('/products/product/:productname', getProductsByName);
router.get('/check-images', checkImagesExist);
router.get('/products/all-products', getallProducts);

router.post('/register', register);
router.post('/verify-email', verifyEmail);

router.post('/login', login);
router.post('/refresh-token', verifyToken , refreshToken);
router.post('/logout', verifyToken, logout);
router.post('/request-new-code' , requestNewCode)

router.get('/me', verifyToken ,  getMe);
router.delete('/delete-product/:productId', verifyToken , deleteProduct);

router.get('/cart', verifyToken, getCart);
router.post('/cart/add', verifyToken, addToCart);
router.post('/cart/remove', verifyToken, removeFromCart);
router.put('/cart/update', verifyToken, updateCart);
module.exports = router;
