const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    types: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductType',
    }],
});

module.exports = mongoose.model('Category', categorySchema);
