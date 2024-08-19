const express = require("express");
const router = express.Router();
const { getTest } = require('../controllers/authControllers')
const { addProduct, editProduct, deleteProduct } = require('../controllers/productControllers');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/productImages/'); // Specify the destination folder
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


router.get('/test', getTest);
router.post('/add-product', upload.single('image'), addProduct);

router.put('/edit-product/:productId', upload.single('image'), editProduct);
router.delete('/delete-product/:productId', deleteProduct);

module.exports = router;
