const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Please add a transaction title'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive or negative number']
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: [true, 'Please specify if transaction is income or expense']
    },
    category: {
        type: String, // Keeping it simple for now, can be ObjectId ref to Category
        required: [true, 'Please add a category']
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
