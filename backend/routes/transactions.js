const express = require('express');
const { getTransactions, addTransaction, deleteTransaction, updateTransaction } = require('../controllers/transactions');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
    .get(protect, getTransactions)
    .post(protect, addTransaction);

router.route('/:id')
    .delete(protect, deleteTransaction)
    .put(protect, updateTransaction);

module.exports = router;
