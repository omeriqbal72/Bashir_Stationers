const mongoose = require('mongoose');

const productTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true,
    },


    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],

    
});

productTypeSchema.index({ name: 'text' });
module.exports = mongoose.model('ProductType', productTypeSchema);
