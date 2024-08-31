const mongoose = require('mongoose');
const subcategory = require('./subcategory');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    subcategories:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:subcategory,
    }],

    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product',
    }]
});

module.exports = mongoose.model('Category', categorySchema);
