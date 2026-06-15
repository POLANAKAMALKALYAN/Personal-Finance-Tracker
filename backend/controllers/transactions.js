const Transaction = require('../models/Transaction');

// @desc    Get all transactions for logged in user
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Private
exports.addTransaction = async (req, res) => {
    try {
        const { title, amount, type, category, date } = req.body;

        const transaction = await Transaction.create({
            title,
            amount,
            type,
            category,
            date,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            data: transaction
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        } else {
            return res.status(500).json({ success: false, error: 'Server Error' });
        }
    }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ success: false, error: 'No transaction found' });
        }

        // Make sure user owns transaction
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to delete this transaction' });
        }

        await transaction.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
exports.updateTransaction = async (req, res) => {
    try {
        let transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ success: false, error: 'No transaction found' });
        }

        // Make sure user owns transaction
        if (transaction.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this transaction' });
        }

        transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: transaction
        });
    } catch (err) {
        return res.status(500).json({ success: false, error: 'Server Error' });
    }
};
