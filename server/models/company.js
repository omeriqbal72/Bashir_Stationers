const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
});

companySchema.index({ name: 'text' });
module.exports = mongoose.model('Company', companySchema);
