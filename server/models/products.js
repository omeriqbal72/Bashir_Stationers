const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
    }
});

module.exports = mongoose.model('Products', productSchema);
