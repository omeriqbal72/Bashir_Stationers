const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    types:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'ProductType'
    }],

    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }]
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
