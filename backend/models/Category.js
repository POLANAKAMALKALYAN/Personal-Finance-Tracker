const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        trim: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Please specify if category is income or expense']
    }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
