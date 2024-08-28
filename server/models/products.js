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
    categories: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }],
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType',
        required: true,
    },
    colors:{
        type: [String]
    },
    quantity:{
        type: Number,
        required:true
    },
    price: {
        type: Number,
        required: true,
    },
    images: {
        type: [String],
    },

    
});

module.exports = mongoose.model('Product', productSchema);
