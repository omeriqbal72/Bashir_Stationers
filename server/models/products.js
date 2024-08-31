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
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true,
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType',
        required: true,
    },
    colors:{
        type: [String]
    },

    description:{
        type: String,
        required: true,
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

    date: {
        type: Date,
        default: Date.now,
    },
    
});

module.exports = mongoose.model('Product', productSchema);
